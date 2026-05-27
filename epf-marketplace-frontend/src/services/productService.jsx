 
import apiClient from "./apiClient"; // Le Dev A configure ce client avec les intercepteurs
 
/**
 * ── Catalogue public ──────────────────────────────────────────
 */
 
// GET /api/products
export const getProducts = (params = {}) =>
  apiClient.get("/products", { params });
// params : { page, per_page, category_id, seller_id, min_price,
//            max_price, sort, q }
 
// GET /api/products/top-selling
export const getTopSelling = (limit = 10) =>
  apiClient.get("/products/top-selling", { params: { limit } });
 
// GET /api/products/:id
export const getProduct = (id) =>
  apiClient.get(`/products/${id}`);
 
// GET /api/products/:id/reviews
export const getProductReviews = (id, params = {}) =>
  apiClient.get(`/products/${id}/reviews`, { params });
 
// GET /api/products/:id/is-favorite  (auth requise)
export const isProductFavorite = (id) =>
  apiClient.get(`/products/${id}/is-favorite`);
 
/**
 * ── Catégories ────────────────────────────────────────────────
 */
 
// GET /api/categories
export const getCategories = () =>
  apiClient.get("/categories");
 
// GET /api/categories/:id
export const getCategory = (id) =>
  apiClient.get(`/categories/${id}`);
 
/**
 * ── Recherche ─────────────────────────────────────────────────
 */
 
// GET /api/search?q=...&type=...&limit=...
export const search = (q, type = "all", limit = 12) =>
  apiClient.get("/search", { params: { q, type, limit } });
 
/**
 * ── Profil vendeur public ─────────────────────────────────────
 */
 
// GET /api/sellers/:userId
export const getSellerProfile = (userId) =>
  apiClient.get(`/sellers/${userId}`);
 
// GET /api/sellers/:userId/products
export const getSellerProducts = (userId, params = {}) =>
  apiClient.get(`/sellers/${userId}/products`, { params });
 
// GET /api/sellers/:userId/reviews
export const getSellerReviews = (userId, params = {}) =>
  apiClient.get(`/sellers/${userId}/reviews`, { params });
 
/**
 * ── Produits vendeur (auth requise) ──────────────────────────
 */
 
// GET /api/products/my-products
export const getMyProducts = (params = {}) =>
  apiClient.get("/products/my-products", { params });
 
// POST /api/products
export const createProduct = (formData) =>
  apiClient.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
 
// PUT /api/products/:id
export const updateProduct = (id, formData) =>
  apiClient.post(`/products/${id}`, formData, {
    // Laravel accepte PUT via POST + _method en multipart
    headers: { "Content-Type": "multipart/form-data" },
    params: { _method: "PUT" },
  });
 
// DELETE /api/products/:id
export const deleteProduct = (id) =>
  apiClient.delete(`/products/${id}`);
 
/**
 * ── Avis (auth requise) ───────────────────────────────────────
 */
 
// POST /api/products/:id/reviews
export const createReview = (productId, data) =>
  apiClient.post(`/products/${productId}/reviews`, data);
 
// DELETE /api/reviews/:id
export const deleteReview = (reviewId) =>
  apiClient.delete(`/reviews/${reviewId}`);