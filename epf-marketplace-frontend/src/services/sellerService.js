import axiosClient from "./api/axiosClient";

const rootData = (payload) => payload?.data ?? payload;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

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
  pickArray(payload, ["orders", "items"]).map((order) => {
    const itemsArray = order.items ?? order.order_items ?? order.orderItems ?? [];
    const itemsCount =
      order.items_count ??
      order.order_items_count ??
      order.items_qty ??
      order.quantity ??
      order.qty ??
      (Array.isArray(itemsArray) ? itemsArray.length : 0);

    return {
      id: order.id ?? order.order_number ?? order.reference,
      reference:
        order.reference ??
        order.order_number ??
        `CMD-${String(order.id).padStart(4, "0")}`,
      status: order.status ?? "pending",
      total: toNumber(order.total ?? order.total_amount ?? order.amount ?? 0),
      createdAt: order.created_at ?? order.date ?? null,
      customer:
        order.customer ??
        order.user ??
        { name: order.customer_name ?? order.buyer_name ?? "Client" },
      items: itemsArray,
      itemsCount,
      raw: order,
    };
  });

const normalizeDashboard = (payload) => {
  const root = rootData(payload);
  const data = root?.dashboard ?? root?.stats ?? root;

  return {
    revenue: toNumber(data?.total_revenue ?? data?.total_sales ?? data?.revenue ?? 0),
    ordersCount: toNumber(data?.total_orders ?? data?.orders_count ?? 0),
    pendingOrders: toNumber(data?.pending_orders ?? data?.pending ?? 0),
    publishedProducts: toNumber(
      data?.published_products ?? data?.active_products ?? data?.products_published ?? 0
    ),
    draftProducts: toNumber(data?.draft_products ?? 0),
    recentOrders: normalizeOrders(
      data?.recent_orders ?? data?.latest_orders ?? data?.recentOrders ?? []
    ),
    raw: data,
  };
};

const arrayToStatusMap = (arr) => {
  if (!Array.isArray(arr)) return null;

  const result = {};
  arr.forEach((item) => {
    const key = item.status ?? item.statut ?? item.name ?? item.label ?? item.key;
    const val = toNumber(item.count ?? item.total ?? item.value ?? item.qty ?? 0);
    if (key != null) result[key] = val;
  });

  return Object.keys(result).length > 0 ? result : null;
};

const normalizeStatistics = (payload, dashboardData = null) => {
  const root = rootData(payload);
  const data = root?.statistics ?? root?.stats ?? root;

  const salesByMonth =
    data?.sales_by_month ??
    data?.monthly_sales ??
    data?.sales_per_month ??
    data?.monthly_revenue ??
    root?.sales_by_month ??
    root?.monthly_sales ??
    [];

  const rawStatus =
    data?.orders_by_status ??
    data?.status_breakdown ??
    data?.order_status ??
    data?.statuses ??
    root?.orders_by_status ??
    root?.status_breakdown ??
    null;

  let ordersByStatus = {};
  if (rawStatus !== null) {
    if (Array.isArray(rawStatus)) {
      ordersByStatus = arrayToStatusMap(rawStatus) ?? {};
    } else if (typeof rawStatus === "object") {
      ordersByStatus = rawStatus;
    }
  }

  const topProducts =
    data?.top_products ??
    data?.best_sellers ??
    data?.top_selling ??
    data?.products ??
    root?.top_products ??
    root?.best_sellers ??
    [];

  // KPI enrichis : on combine les données de /seller/statistics et /seller/dashboard
  const dash = dashboardData?.raw ?? dashboardData ?? {};
  const kpis = {
    totalRevenue: toNumber(
      data?.total_revenue ?? data?.total_sales ?? data?.revenue ?? root?.total_revenue ??
      dash?.total_sales ?? dash?.total_revenue ?? dash?.revenue ?? 0
    ),
    totalOrders: toNumber(
      data?.total_orders ?? data?.orders_count ?? root?.total_orders ??
      dash?.total_orders ?? dash?.orders_count ?? 0
    ),
    pendingOrders: toNumber(
      data?.pending_orders ?? root?.pending_orders ??
      dash?.pending_orders ?? dash?.pending ?? 0
    ),
    publishedProducts: toNumber(
      data?.published_products ?? data?.active_products ?? root?.published_products ??
      dash?.published_products ?? dash?.active_products ?? 0
    ),
    averageOrderValue: toNumber(
      data?.average_order_value ?? root?.average_order_value ??
      dash?.average_order_value ?? 0
    ),
    conversionRate: toNumber(
      data?.conversion_rate ?? root?.conversion_rate ?? dash?.conversion_rate ?? 0
    ),
    totalViews: toNumber(
      data?.total_views ?? root?.total_views ?? dash?.total_views ?? 0
    ),
    customerSatisfaction: toNumber(
      data?.customer_satisfaction ?? root?.customer_satisfaction ??
      dash?.customer_satisfaction ?? 0
    ),
    growthRate: toNumber(
      data?.growth_rate ?? root?.growth_rate ?? dash?.growth_rate ?? 0
    ),
  };

  return {
    kpis,
    salesByMonth: Array.isArray(salesByMonth) ? salesByMonth : [],
    ordersByStatus,
    topProducts: Array.isArray(topProducts) ? topProducts : [],
    raw: data,
  };
};

export const sellerService = {
  async getDashboard() {
    const { data } = await axiosClient.get("/seller/dashboard");
    const dashboard = normalizeDashboard(data);

    try {
      const fullOrders = await sellerService.getOrders();
      const countMap = {};
      fullOrders.forEach((o) => {
        countMap[o.reference] = o.itemsCount;
      });
      dashboard.recentOrders = dashboard.recentOrders.map((o) => ({
        ...o,
        itemsCount: countMap[o.reference] ?? o.itemsCount,
      }));
    } catch (_) {
      // Si /seller/orders échoue, on garde les données du dashboard
    }

    return dashboard;
  },

  async getStatistics() {
    // On appelle les deux endpoints en parallèle pour enrichir les KPI
    const [statsRes, dashRes] = await Promise.allSettled([
      axiosClient.get("/seller/statistics"),
      axiosClient.get("/seller/dashboard"),
    ]);

    const statsData = statsRes.status === "fulfilled" ? statsRes.value.data : {};
    const dashData = dashRes.status === "fulfilled"
      ? normalizeDashboard(dashRes.value.data)
      : null;

    return normalizeStatistics(statsData, dashData);
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