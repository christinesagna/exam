import axiosClient from "./api/axiosClient";
import { normalizeProduct } from "./productService";

function extractList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.coupons)) return payload.coupons;
  return [];
}

function normalizePagination(payload = {}, fallbackTotal = 0) {
  const source = payload?.pagination ?? payload?.meta ?? payload ?? {};

  return {
    current_page: Number(source.current_page ?? source.currentPage ?? source.page ?? 1),
    last_page: Number(source.last_page ?? source.lastPage ?? source.total_pages ?? 1),
    total: Number(source.total ?? payload?.total ?? fallbackTotal),
  };
}

async function getWithFallback(urls, config = {}) {
  let lastError;

  for (const url of urls) {
    try {
      const response = await axiosClient.get(url, config);
      return response.data;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (status && status !== 404 && status !== 405) {
        throw error;
      }
    }
  }

  throw lastError;
}

function normalizeUsersPayload(payload) {
  const users = extractList(payload);

  return {
    users,
    pagination: normalizePagination(payload, users.length),
  };
}

function normalizeProductsPayload(payload) {
  const products = extractList(payload).map((item) => normalizeProduct(item));

  return {
    products,
    pagination: normalizePagination(payload, products.length),
  };
}

function normalizeCoupon(raw = {}) {
  const activeValue =
    raw?.is_active ??
    raw?.active ??
    (typeof raw?.status === "string" ? raw.status.toLowerCase() === "active" : undefined);

  const isActive = typeof activeValue === "boolean" ? activeValue : true;

  return {
    id: raw?.id ?? raw?.coupon_id ?? raw?.uuid ?? raw?.code,
    code: raw?.code ?? raw?.name ?? "",
    type: raw?.type ?? raw?.discount_type ?? "fixed",
    value: Number(raw?.value ?? raw?.discount ?? raw?.amount ?? 0),
    usage_limit: raw?.usage_limit ?? raw?.max_uses ?? raw?.limit ?? "",
    used_count: Number(
      raw?.used_count ?? raw?.usage_count ?? raw?.used ?? raw?.times_used ?? 0
    ),
    // backend uses starts_at / ends_at names — accept those as expiration fields
    expires_at:
      raw?.expires_at ?? raw?.expiresAt ?? raw?.expiration_date ?? raw?.ends_at ?? raw?.endsAt ?? "",
    starts_at: raw?.starts_at ?? raw?.startsAt ?? raw?.startsAt ?? raw?.starts_at ?? null,
    is_active: isActive,
    status: raw?.status ?? (isActive ? "active" : "inactive"),
    description: raw?.description ?? raw?.note ?? raw?.notes ?? "",
  };
}

function normalizeCouponsPayload(payload) {
  const coupons = extractList(payload).map(normalizeCoupon);

  return {
    coupons,
    pagination: normalizePagination(payload, coupons.length),
  };
}

export const adminService = {
  async getStats() {
    const { data } = await axiosClient.get("/admin/stats");
    return {
      users_count: Number(data?.users_count ?? 0),
      products_count: Number(data?.products_count ?? 0),
      orders_count: Number(data?.orders_count ?? 0),
      total_revenue: Number(data?.total_revenue ?? 0),
    };
  },

  async getUsers({ page = 1, perPage = 10, role = "" } = {}) {
    const params = {
      page,
      per_page: perPage,
    };

    if (role) {
      params.role = role;
    }

    const { data } = await axiosClient.get("/admin/users", { params });
    return normalizeUsersPayload(data);
  },

  async suspendUser(userId) {
    const { data } = await axiosClient.post(`/admin/users/${userId}/suspend`);
    return data;
  },

  async activateUser(userId) {
    const { data } = await axiosClient.post(`/admin/users/${userId}/activate`);
    return data;
  },

  async getProducts({ page = 1, perPage = 10, status = "", search = "" } = {}) {
    const params = {
      page,
      per_page: perPage,
    };

    if (status) params.status = status;
    if (search) params.search = search;

    const data = await getWithFallback(
      ["/admin/products", "/products", "/public/products"],
      { params }
    );

    return normalizeProductsPayload(data);
  },

  async updateProductStatus(productId, status) {
    const { data } = await axiosClient.patch(`/admin/products/${productId}/status`, { status });
    return data;
  },

  async forceDeleteProduct(productId) {
    const { data } = await axiosClient.delete(`/admin/products/${productId}/force`);
    return data;
  },

  async getCoupons({ page = 1, perPage = 20 } = {}) {
    const { data } = await axiosClient.get("/admin/coupons", {
      params: {
        page,
        per_page: perPage,
      },
    });

    return normalizeCouponsPayload(data);
  },

  async createCoupon(payload) {
    const { data } = await axiosClient.post("/admin/coupons", payload);
    return normalizeCoupon(data?.data ?? data);
  },

  async updateCoupon(couponId, payload) {
    const { data } = await axiosClient.put(`/admin/coupons/${couponId}`, payload);
    return normalizeCoupon(data?.data ?? data);
  },

  async deleteCoupon(couponId) {
    const { data } = await axiosClient.delete(`/admin/coupons/${couponId}`);
    return data;
  },
};
