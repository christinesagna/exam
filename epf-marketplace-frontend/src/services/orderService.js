// src/services/orderService.js
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

  /**
   * Valide un code coupon et retourne les infos de réduction.
   * L'API backend doit exposer GET /api/coupons/validate?code=XXX
   * ou POST /api/coupons/validate { code: "XXX" }.
   * On essaie GET en premier, puis POST en fallback.
   */
  async validateCoupon(code, subtotal = 0) {
    try {
      const { data } = await axiosClient.get("/coupons/validate", {
        params: { code, subtotal },
      });
      return data;
    } catch (err) {
      // fallback POST si le backend expose un endpoint POST
      if (err?.response?.status === 405 || err?.response?.status === 404) {
        const { data } = await axiosClient.post("/coupons/validate", { code, subtotal });
        return data;
      }
      throw err;
    }
  },
};