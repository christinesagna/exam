import axiosClient from './api/axiosClient';

export const orderService = {
  createOrder: async (payload) => {
    const { data } = await axiosClient.post('/orders', payload);
    return data;
  },

  getMyOrders: async (params = {}) => {
    const { data } = await axiosClient.get('/orders/my-orders', { params });
    return data;
  },

  getOrderById: async (id) => {
    const { data } = await axiosClient.get(`/orders/${id}`);
    return data;
  },
};
