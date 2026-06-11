import axiosClient from "./api/axiosClient";

function normalizeCollectionResponse(raw) {
  const root = raw?.data ?? raw;
  const items = root?.data || root?.items || (Array.isArray(root) ? root : []);

  return {
    items,
    pagination: root?.pagination || {
      current_page: root?.current_page || 1,
      last_page: root?.last_page || 1,
      total: root?.total || items.length,
    },
  };
}

export const sellerService = {
  async getDashboard() {
    const { data } = await axiosClient.get("/seller/dashboard");
    return data;
  },

  async getStatistics(period = "month") {
    const { data } = await axiosClient.get("/seller/statistics", {
      params: { period },
    });
    return data;
  },

  async getOrders(params = {}) {
    const { data } = await axiosClient.get("/seller/orders", { params });
    return normalizeCollectionResponse(data);
  },

  async updateOrderStatus(orderId, status) {
    const { data } = await axiosClient.put(`/orders/${orderId}/status`, { status });
    return data?.order || data;
  },
};
