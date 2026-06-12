import axiosClient from "./api/axiosClient";

// URL de base Laravel (ex: http://localhost:8000)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

// ─────────────────────────────────────────────
// Helpers génériques
// ─────────────────────────────────────────────

async function getWithFallback(urls, config = {}) {
  let lastError;
  for (const url of urls) {
    try {
      const response = await axiosClient.get(url, config);
      return response.data;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (status && status !== 404 && status !== 405) throw error;
    }
  }
  throw lastError;
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.products)) return value.products;
  if (Array.isArray(value?.images)) return value.images;
  return [];
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// ─────────────────────────────────────────────
// Conversion URL image → URL absolue
// Laravel retourne souvent : "storage/products/xxx.jpg"
// ou "/storage/products/xxx.jpg"
// Il faut préfixer avec http://localhost:8000
// ─────────────────────────────────────────────
function toAbsoluteUrl(value) {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Déjà une URL absolue ou data URI
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `http:${trimmed}`;
  }

  // Chemin relatif (avec ou sans "/" initial)
  // ex: "storage/products/img.jpg" → "http://localhost:8000/storage/products/img.jpg"
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${API_ORIGIN}${path}`;
}

// Extrait l'URL d'une entrée image quelle que soit sa forme
// Laravel peut retourner : une string, ou un objet {url, path, image_url, src...}
function extractImageUrl(entry) {
  if (!entry) return null;

  if (typeof entry === "string") {
    return toAbsoluteUrl(entry);
  }

  if (!isObject(entry)) return null;

  // Tous les champs possibles que Laravel peut utiliser
  const raw =
    entry.url ??
    entry.image_url ??
    entry.src ??
    entry.path ??
    entry.full_url ??
    entry.original_url ??
    entry.file_url ??
    entry.image ??
    entry.thumbnail ??
    entry.thumbnail_url ??
    entry.imageUrl ??
    entry.filePath ??
    null;

  return toAbsoluteUrl(raw);
}

// ─────────────────────────────────────────────
// Extraction de la source brute du produit
// ─────────────────────────────────────────────
function extractProductSource(raw) {
  const firstLevel = raw?.data ?? raw;
  return (
    firstLevel?.product ??
    firstLevel?.item ??
    firstLevel?.details ??
    firstLevel?.product_details ??
    firstLevel
  );
}

// ─────────────────────────────────────────────
// Extraction et normalisation des images
// Retourne un tableau de strings (URLs absolues)
// ─────────────────────────────────────────────
function extractProductImages(source = {}) {
  const collected = [];

  const addUrl = (entry) => {
    const url = extractImageUrl(entry);
    if (url && !collected.includes(url)) collected.push(url);
  };

  // 1. Tableaux d'images (priorité)
  [
    source.images,
    source.gallery,
    source.photos,
    source.media,
    source.attachments,
  ].forEach((list) => {
    toArray(list).forEach(addUrl);
  });

  // 2. Champs image uniques (fallback)
  [
    source.image_url,
    source.thumbnail,
    source.thumbnail_url,
    source.image,
    source.imageUrl,
    source.image_path,
    source.photo,
    source.photo_url,
    source.cover,
    source.cover_url,
    source.main_image,
    source.main_image_url,
  ].forEach(addUrl);

  return collected; // tableau de strings URL absolues
}

// ─────────────────────────────────────────────
// Normalisation d'un produit
// ─────────────────────────────────────────────
export function normalizeProduct(rawProduct = {}) {
  const source = extractProductSource(rawProduct);

  if (!isObject(source)) return source;

  // Images = tableau de strings URL absolues
  const images = extractProductImages(source);
  const firstImage = images[0] ?? null; // string directement

  const sellerSource =
    source.seller ?? source.vendor ?? source.owner ?? source.user ?? source.shop ?? null;

  const categorySource =
    source.category ?? source.product_category ?? source.category_data ?? null;

  const normalizedSeller = sellerSource
    ? {
        ...sellerSource,
        id:
          sellerSource.id ?? sellerSource.user_id ?? source.seller_id ?? source.vendor_id ?? null,
        name:
          sellerSource.name ??
          sellerSource.full_name ??
          sellerSource.shop_name ??
          source.seller_name ??
          source.vendor_name ??
          "Vendeur",
      }
    : source.seller_id || source.seller_name || source.vendor_name
    ? { id: source.seller_id ?? source.vendor_id ?? null, name: source.seller_name ?? source.vendor_name ?? "Vendeur" }
    : null;

  const normalizedCategory = categorySource
    ? {
        ...categorySource,
        id: categorySource.id ?? source.category_id ?? null,
        name: categorySource.name ?? categorySource.title ?? source.category_name ?? "",
      }
    : source.category_id || source.category_name
    ? { id: source.category_id ?? null, name: source.category_name ?? "" }
    : null;

  return {
    ...source,
    id: source.id ?? source.product_id ?? source.uuid ?? null,
    title: source.title ?? source.name ?? source.product_name ?? "",
    name: source.name ?? source.title ?? source.product_name ?? "",
    description: source.description ?? source.details ?? source.summary ?? "",
    price: Number(source.price ?? source.unit_price ?? source.amount ?? 0),
    effective_price: Number(
      source.effective_price ??
        source.sale_price ??
        source.flash_price ??
        source.discount_price ??
        source.price ??
        0
    ),
    stock: Number(source.stock ?? source.quantity ?? source.qty ?? source.available_stock ?? 0),
    // thumbnail et image sont des STRINGS (URL absolue), pas des objets
    thumbnail: firstImage,
    image: firstImage,
    image_url: firstImage,
    // images est un tableau de STRINGS (URLs absolues)
    images,
    seller: normalizedSeller,
    category: normalizedCategory,
    reviews:
      toArray(source.reviews).length > 0
        ? toArray(source.reviews)
        : toArray(source.product_reviews).length > 0
        ? toArray(source.product_reviews)
        : toArray(source.review_list),
  };
}

function normalizeListResponse(raw) {
  const root = raw?.data ?? raw;
  const collectionContainer =
    root?.products ??
    root?.items ??
    root?.results ??
    root?.favorites ??
    root?.data ??
    root;

  const items = toArray(collectionContainer).map(normalizeProduct);

  return {
    items,
    currentPage:
      collectionContainer?.current_page ??
      root?.current_page ??
      root?.pagination?.current_page ??
      root?.meta?.current_page ??
      1,
    lastPage:
      collectionContainer?.last_page ??
      root?.last_page ??
      root?.pagination?.last_page ??
      root?.meta?.last_page ??
      1,
    total:
      collectionContainer?.total ??
      root?.total ??
      root?.pagination?.total ??
      root?.meta?.total ??
      items.length,
  };
}

function normalizeSingleResponse(raw) {
  return normalizeProduct(raw);
}

export const productService = {
  async list(params = {}) {
    const data = await getWithFallback(["/products", "/public/products"], { params });
    return normalizeListResponse(data);
  },

  async search(params = {}) {
    const data = await getWithFallback(
      ["/search", "/products/search", "/search/products"],
      { params }
    );
    return normalizeListResponse(data);
  },

  async searchGlobal(params = {}) {
    const { data } = await axiosClient.get("/search", { params });
    return data;
  },

  async topSelling(limit = 8) {
    const data = await getWithFallback(
      ["/products/top-selling", "/top-selling/products"],
      { params: { limit } }
    );
    return normalizeListResponse(data);
  },

  async getTopSelling(limit = 8) {
    return this.topSelling(limit);
  },

  async getById(id) {
    const data = await getWithFallback([`/products/${id}`, `/public/products/${id}`]);
    return normalizeSingleResponse(data);
  },

  async getProductReviews(id, params = {}) {
    const data = await getWithFallback([`/products/${id}/reviews`], { params });
    return normalizeListResponse(data);
  },

  async getCategories() {
    const data = await getWithFallback(["/categories", "/public/categories"]);
    const root = data?.data ?? data;
    return root?.data || root?.categories || (Array.isArray(root) ? root : []);
  },

  async getSellerPublic(id) {
    const data = await getWithFallback([`/sellers/${id}`, `/seller/${id}`, `/users/${id}`]);
    return data?.data ?? data?.seller ?? data?.user ?? data;
  },

  async getSellerProducts(id, params = {}) {
    const data = await getWithFallback(
      [`/sellers/${id}/products`, `/seller/${id}/products`, `/users/${id}/products`],
      { params }
    );
    return normalizeListResponse(data);
  },

  async getSellerReviews(id, params = {}) {
    const data = await getWithFallback(
      [`/sellers/${id}/reviews`, `/seller/${id}/reviews`, `/users/${id}/reviews`],
      { params }
    );
    return normalizeListResponse(data);
  },
};

/* ── Exports nommés pour compatibilité ── */

export const getProducts = async (params = {}) => productService.list(params);
export const getTopSelling = async (limit = 10) => productService.topSelling(limit);
export const getProduct = async (id) => productService.getById(id);
export const getProductReviews = async (id, params = {}) => productService.getProductReviews(id, params);

// Récupère un produit appartenant au vendeur connecté, sans filtre de statut
// (utilisé pour l'édition, car la route publique /products/{id} masque
// les produits dont le statut n'est pas "published")
export const getOwnProduct = async (id) => {
  const { data } = await axiosClient.get(`/products/${id}/owner`);
  return normalizeProduct(data);
};

export const isProductFavorite = async (id) => {
  const { data } = await axiosClient.get(`/products/${id}/is-favorite`);
  return data;
};

export const getCategories = async () => productService.getCategories();

export const getCategory = async (id) => {
  const { data } = await axiosClient.get(`/categories/${id}`);
  return data;
};

export const searchProducts = async (q, type = "all", limit = 12) => {
  const { data } = await axiosClient.get("/search", { params: { q, type, limit } });
  return data;
};

export const getSellerProfile = async (userId) => productService.getSellerPublic(userId);
export const getSellerProducts = async (userId, params = {}) => productService.getSellerProducts(userId, params);
export const getSellerReviews = async (userId, params = {}) => productService.getSellerReviews(userId, params);

export const getMyProducts = async (params = {}) => {
  const data = await getWithFallback(
    ["/products/my-products", "/seller/products", "/sellers/me/products", "/users/me/products"],
    { params }
  );
  return normalizeListResponse(data);
};

export const createProduct = async (formData) => {
  const { data } = await axiosClient.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateProduct = async (id, formData) => {
  const { data } = await axiosClient.post(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { _method: "PUT" },
  });
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await axiosClient.delete(`/products/${id}`);
  return data;
};

export const createReview = async (productId, payload) => {
  const { data } = await axiosClient.post(`/products/${productId}/reviews`, payload);
  return data;
};

export const deleteReview = async (reviewId) => {
  const { data } = await axiosClient.delete(`/reviews/${reviewId}`);
  return data;
};

export default productService;
