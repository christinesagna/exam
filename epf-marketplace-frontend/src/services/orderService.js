import axiosClient from "./api/axiosClient";

export const orderService = {
  async createOrder(payload) {
    const { data } = await axiosClient.post("/orders", payload);
    return data;
  },

  async getMyOrders(params = {}) {
    const { data } = await axiosClient.get("/orders/my-orders", { params });
    return data;
  },

  async getOrderById(id) {
    const { data } = await axiosClient.get(`/orders/${id}`);
    return data;
  },

  async cancelOrder(id) {
    const { data } = await axiosClient.post(`/orders/${id}/cancel`);
    return data;
  },
};
