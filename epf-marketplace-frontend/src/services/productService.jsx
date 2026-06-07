import axiosClient from "./api/axiosClient";


async function getWithFallback(urls, config = {}) {
  let lastError;

  for (const url of urls) {
    try {
      const response = await axiosClient.get(url, config);
      return response.data;
    } catch (error) {
      lastError = error;

      const status = error?.response?.status;
      if (status && status !== 404 && status !== 405) {
        throw error;
      }
    }
  }

  throw lastError;
}

function normalizeListResponse(raw) {
  const root = raw?.data ?? raw;

  const items =
    root?.data ||
    root?.products ||
    root?.items ||
    (Array.isArray(root) ? root : []);

  return {
    items,
    currentPage: root?.current_page || root?.meta?.current_page || 1,
    lastPage: root?.last_page || root?.meta?.last_page || 1,
    total: root?.total || root?.meta?.total || items.length,
  };
}

function normalizeSingleResponse(raw) {
  return raw?.data || raw?.product || raw?.seller || raw?.user || raw;
}

export const productService = {
  async list(params = {}) {
    const data = await getWithFallback(
      ["/products", "/public/products"],
      { params }
    );

    return normalizeListResponse(data);
  },

  async search(params = {}) {
    try {
      const data = await getWithFallback(
        ["/products/search", "/search/products"],
        { params }
      );

      return normalizeListResponse(data);
    } catch {
      return this.list(params);
    }
  },

  async getById(id) {
    const data = await getWithFallback([
      `/products/${id}`,
      `/public/products/${id}`,
    ]);

    return normalizeSingleResponse(data);
  },

  async getCategories() {
    const data = await getWithFallback([
      "/categories",
      "/public/categories",
    ]);

    const root = data?.data ?? data;
    return root?.data || root?.categories || (Array.isArray(root) ? root : []);
  },

  async getSellerPublic(id) {
    const data = await getWithFallback([
      `/sellers/${id}`,
      `/seller/${id}`,
      `/users/${id}`,
    ]);

    return normalizeSingleResponse(data);
  },

  async getSellerProducts(id, params = {}) {
    const data = await getWithFallback(
      [
        `/sellers/${id}/products`,
        `/seller/${id}/products`,
        `/users/${id}/products`,
      ],
      { params }
    );

    return normalizeListResponse(data);
  },
};

/**
 * ── Catalogue public ──────────────────────────────────────────
 */

// GET /api/products
export const getProducts = async (params = {}) => {
  const { data } = await axiosClient.get("/products", { params });
  return data;
};

// GET /api/products/top-selling
export const getTopSelling = async (limit = 10) => {
  const { data } = await axiosClient.get("/products/top-selling", {
    params: { limit },
  });
  return data;
};

// GET /api/products/:id
export const getProduct = async (id) => {
  const { data } = await axiosClient.get(`/products/${id}`);
  return data;
};

// GET /api/products/:id/reviews
export const getProductReviews = async (id, params = {}) => {
  const { data } = await axiosClient.get(`/products/${id}/reviews`, { params });
  return data;
};

// GET /api/products/:id/is-favorite
export const isProductFavorite = async (id) => {
  const { data } = await axiosClient.get(`/products/${id}/is-favorite`);
  return data;
};

/**
 * ── Catégories ────────────────────────────────────────────────
 */

export const getCategories = async () => {
  const { data } = await axiosClient.get("/categories");
  return data;
};

export const getCategory = async (id) => {
  const { data } = await axiosClient.get(`/categories/${id}`);
  return data;
};

/**
 * ── Recherche ─────────────────────────────────────────────────
 */

export const searchProducts = async (q, type = "all", limit = 12) => {
  const { data } = await axiosClient.get("/search", {
    params: { q, type, limit },
  });
  return data;
};

/**
 * ── Profil vendeur public ─────────────────────────────────────
 */

export const getSellerProfile = async (userId) => {
  const { data } = await axiosClient.get(`/sellers/${userId}`);
  return data;
};

export const getSellerProducts = async (userId, params = {}) => {
  const { data } = await axiosClient.get(`/sellers/${userId}/products`, {
    params,
  });
  return data;
};

export const getSellerReviews = async (userId, params = {}) => {
  const { data } = await axiosClient.get(`/sellers/${userId}/reviews`, {
    params,
  });
  return data;
};

/**
 * ── Produits vendeur (auth requise) ──────────────────────────
 */

export const getMyProducts = async (params = {}) => {
  const { data } = await axiosClient.get("/products/my-products", { params });
  return data;
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

/**
 * ── Avis (auth requise) ───────────────────────────────────────
 */

export const createReview = async (productId, payload) => {
  const { data } = await axiosClient.post(`/products/${productId}/reviews`, payload);
  return data;
};

export const deleteReview = async (reviewId) => {
  const { data } = await axiosClient.delete(`/reviews/${reviewId}`);
  return data;
};

export default productService;
