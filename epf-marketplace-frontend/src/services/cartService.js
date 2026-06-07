import axiosClient from './api/axiosClient';

export const cartService = {
  getCart: async () => {
    const { data } = await axiosClient.get('/cart');
    return data;
  },

  addToCart: async (payload) => {
    const { data } = await axiosClient.post('/cart/add', payload);
    return data;
  },

  updateCartItem: async (cartItemId, payload) => {
    const { data } = await axiosClient.put(`/cart/items/${cartItemId}`, payload);
    return data;
  },

  removeCartItem: async (cartItemId) => {
    const { data } = await axiosClient.delete(`/cart/items/${cartItemId}`);
    return data;
  },

  clearCart: async () => {
    const { data } = await axiosClient.delete('/cart/clear');
    return data;
  },
};
