import axiosClient from "./api/axiosClient";
import { normalizeProduct } from "./productService";

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.favorites)) return value.favorites;
  return [];
}

function extractFavoriteItems(payload) {
  const root = payload?.data ?? payload ?? {};

  const candidates = [root?.favorites, root?.items, root?.data, root];

  for (const candidate of candidates) {
    const items = toArray(candidate);
    if (items.length > 0) {
      return items;
    }
  }

  return [];
}

function normalizeFavoriteItem(item) {
  const productCandidate =
    item?.product ??
    item?.favorite_product ??
    item?.favoritable ??
    item?.item ??
    item?.data ??
    item;

  return normalizeProduct(productCandidate);
}

function dedupeProducts(products = []) {
  const map = new Map();

  products.forEach((product) => {
    if (!product?.id) return;
    map.set(String(product.id), product);
  });

  return Array.from(map.values());
}

export const favoriteService = {
  async listFavorites() {
    const { data } = await axiosClient.get("/favorites", {
      params: {
        per_page: 100,
        limit: 100,
      },
    });

    return dedupeProducts(
      extractFavoriteItems(data)
        .map(normalizeFavoriteItem)
        .filter(Boolean)
    );
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
