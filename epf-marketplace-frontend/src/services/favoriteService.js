import axiosClient from "./api/axiosClient";

export const favoriteService = {
  async listFavorites() {
    const { data } = await axiosClient.get("/favorites");
    return data;
  },

  async addFavorite(productId) {
    const { data } = await axiosClient.post("/favorites/add", {
      product_id: productId,
    });
    return data;
  },

  async removeFavorite(productId) {
    const { data } = await axiosClient.delete(`/favorites/${productId}`);
    return data;
  },

  async isFavorite(productId) {
    const { data } = await axiosClient.get(`/products/${productId}/is-favorite`);
    return data;
  },
};
