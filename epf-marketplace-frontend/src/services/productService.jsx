import axiosClient from "./api/axiosClient";

function unwrap(raw) {
  return raw?.data ?? raw;
}

function normalizeListResponse(raw) {
  const root = unwrap(raw);

  const items =
    root?.data ||
    root?.products ||
    root?.items ||
    (Array.isArray(root) ? root : []);

  return {
    items,
    currentPage: root?.current_page || root?.meta?.current_page || root?.pagination?.current_page || 1,
    lastPage: root?.last_page || root?.meta?.last_page || root?.pagination?.last_page || 1,
    total: root?.total || root?.meta?.total || root?.pagination?.total || items.length,
  };
}

function normalizeSingleResponse(raw) {
  const root = unwrap(raw);
  return root?.data || root?.product || root?.seller || root?.user || root;
}

function normalizeCategories(raw) {
  const root = unwrap(raw);
  return root?.data || root?.categories || (Array.isArray(root) ? root : []);
}

async function safeGet(url, config = {}) {
  const { data } = await axiosClient.get(url, config);
  return data;
}

export const productService = {
  async list(params = {}) {
    const data = await safeGet("/products", { params });
    return normalizeListResponse(data);
  },

  async topSelling(limit = 8) {
    const data = await safeGet("/products/top-selling", {
      params: { limit },
    });
    return normalizeListResponse(data);
  },

  async getById(id) {
    const data = await safeGet(`/products/${id}`);
    return normalizeSingleResponse(data);
  },

  async getReviews(id, params = {}) {
    const data = await safeGet(`/products/${id}/reviews`, { params });
    return normalizeListResponse(data);
  },

  async getCategories() {
    const data = await safeGet("/categories");
    return normalizeCategories(data);
  },

  async getCategory(categoryId) {
    const data = await safeGet(`/categories/${categoryId}`);
    return normalizeSingleResponse(data);
  },

  async searchGlobal(params = {}) {
    const data = await safeGet("/search", { params });
    const root = unwrap(data);
    const payload = root?.data || root;

    return {
      products: payload?.products || payload?.items || [],
      sellers: payload?.sellers || [],
      categories: payload?.categories || [],
    };
  },

  async getSellerPublic(id) {
    const data = await safeGet(`/sellers/${id}`);
    return normalizeSingleResponse(data);
  },

  async getSellerProducts(id, params = {}) {
    const data = await safeGet(`/sellers/${id}/products`, { params });
    return normalizeListResponse(data);
  },

  async getSellerReviews(id, params = {}) {
    const data = await safeGet(`/sellers/${id}/reviews`, { params });
    return normalizeListResponse(data);
  },
};

export default productService;
