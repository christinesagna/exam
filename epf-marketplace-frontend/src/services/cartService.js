import axiosClient from "./api/axiosClient";

export const cartService = {
  async getCart() {
    const { data } = await axiosClient.get("/cart");
    return data;
  },

  async addToCart(payload) {
    const { data } = await axiosClient.post("/cart/add", payload);
    return data;
  },

  async updateCartItem(cartItemId, payload) {
    const { data } = await axiosClient.put(`/cart/items/${cartItemId}`, payload);
    return data;
  },

  async removeCartItem(cartItemId) {
    const { data } = await axiosClient.delete(`/cart/items/${cartItemId}`);
    return data;
  },

  async clearCart() {
    const { data } = await axiosClient.delete("/cart/clear");
    return data;
  },
};
