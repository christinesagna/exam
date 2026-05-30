import axiosClient from "./api/axiosClient";

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

/**
 * ── Compatibilité avec l'ancienne convention Dev A ────────────
 */

export const productService = {
  getAll: getProducts,
  getById: getProduct,
  getTopSelling,
  getProductReviews,
  isProductFavorite,
  getCategories,
  getCategory,
  searchProducts,
  getSellerProfile,
  getSellerProducts,
  getSellerReviews,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  deleteReview,
};

export default productService;
