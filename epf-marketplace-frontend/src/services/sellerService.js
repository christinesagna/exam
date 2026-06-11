import axiosClient from "./api/axiosClient";

const rootData = (payload) => payload?.data ?? payload;

const pickArray = (payload, keys = []) => {
  const root = rootData(payload);

  if (Array.isArray(root)) return root;

  for (const key of keys) {
    if (Array.isArray(root?.[key])) return root[key];
  }

  if (Array.isArray(root?.data)) return root.data;
  return [];
};

const normalizeOrders = (payload) =>
  pickArray(payload, ["orders", "items"]).map((order) => ({
    id: order.id,
    reference:
      order.reference ??
      order.order_number ??
      `CMD-${String(order.id).padStart(4, "0")}`,
    status: order.status ?? "pending",
    total: Number(order.total ?? order.total_amount ?? order.amount ?? 0),
    createdAt: order.created_at ?? order.date ?? null,
    customer:
      order.customer ??
      order.user ??
      { name: order.customer_name ?? order.buyer_name ?? "Client" },
    items: order.items ?? order.order_items ?? [],
    raw: order,
  }));

const normalizeDashboard = (payload) => {
  const root = rootData(payload);
  const data = root?.dashboard ?? root?.stats ?? root;

  return {
    revenue: Number(data?.total_revenue ?? data?.revenue ?? 0),
    ordersCount: Number(data?.total_orders ?? data?.orders_count ?? 0),
    pendingOrders: Number(data?.pending_orders ?? data?.pending ?? 0),
    publishedProducts: Number(
      data?.published_products ?? data?.products_published ?? 0
    ),
    draftProducts: Number(data?.draft_products ?? 0),
    recentOrders: normalizeOrders(data?.recent_orders ?? data?.latest_orders ?? []),
    raw: data,
  };
};

const normalizeStatistics = (payload) => {
  const root = rootData(payload);
  const data = root?.statistics ?? root?.stats ?? root;

  return {
    salesByMonth: data?.sales_by_month ?? data?.monthly_sales ?? [],
    ordersByStatus: data?.orders_by_status ?? data?.status_breakdown ?? {},
    topProducts: data?.top_products ?? data?.best_sellers ?? [],
    raw: data,
  };
};

export const sellerService = {
  async getDashboard() {
    const { data } = await axiosClient.get("/seller/dashboard");
    return normalizeDashboard(data);
  },

  async getStatistics() {
    const { data } = await axiosClient.get("/seller/statistics");
    return normalizeStatistics(data);
  },

  async getOrders(params = {}) {
    const { data } = await axiosClient.get("/seller/orders", { params });
    return normalizeOrders(data);
  },

  async updateOrderStatus(orderId, status) {
    const { data } = await axiosClient.put(`/orders/${orderId}/status`, {
      status,
    });
    return data;
  },
};

export default sellerService;
