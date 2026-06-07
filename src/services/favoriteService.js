import apiClient from "./apiClient";
 
// GET /api/favorites
export const getFavorites = () =>
  apiClient.get("/favorites");
 
// POST /api/favorites/add
export const addFavorite = (productId) =>
  apiClient.post("/favorites/add", { product_id: productId });
 
// DELETE /api/favorites/:productId
export const removeFavorite = (productId) =>
  apiClient.delete(`/favorites/${productId}`);