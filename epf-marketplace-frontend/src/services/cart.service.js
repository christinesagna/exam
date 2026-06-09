import { apiRequest } from './http';

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeCartItem(item = {}) {
  const product = item.product || item.product_data || {};
  const quantity = toNumber(item.quantity, 1);
  const unitPrice = toNumber(item.unit_price ?? item.price ?? product.price, 0);

  return {
    id: item.id ?? item.cart_item_id ?? item.cartItemId ?? Math.random().toString(36).slice(2),
    productId: product.id ?? item.product_id ?? item.productId ?? null,
    name: product.name ?? item.name ?? 'Produit sans nom',
    image: product.image ?? product.image_url ?? item.image ?? '',
    sku: product.sku ?? item.sku ?? '',
    stock: toNumber(product.stock ?? item.stock, 0),
    quantity,
    unitPrice,
    subtotal: toNumber(item.subtotal, quantity * unitPrice),
    raw: item,
  };
}

export function normalizeCart(payload = {}) {
  const source = payload?.data ?? payload?.cart ?? payload;
  const rawItems = source?.items ?? source?.cart_items ?? payload?.items ?? [];
  const items = Array.isArray(rawItems) ? rawItems.map(normalizeCartItem) : [];
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    id: source?.id ?? payload?.id ?? 'current-cart',
    items,
    subtotal: toNumber(source?.subtotal ?? payload?.subtotal, subtotal),
    total: toNumber(source?.total ?? payload?.total, subtotal),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    raw: payload,
  };
}

export async function getCart() {
  const payload = await apiRequest('/api/cart');
  return normalizeCart(payload);
}

export async function addToCart({ productId, quantity = 1 }) {
  const payload = await apiRequest('/api/cart/add', {
    method: 'POST',
    body: {
      product_id: productId,
      quantity,
    },
  });
  return normalizeCart(payload);
}

export async function updateCartItem(cartItemId, quantity) {
  const payload = await apiRequest(`/api/cart/items/${cartItemId}`, {
    method: 'PUT',
    body: { quantity },
  });
  return normalizeCart(payload);
}

export async function removeCartItem(cartItemId) {
  const payload = await apiRequest(`/api/cart/items/${cartItemId}`, {
    method: 'DELETE',
  });
  return normalizeCart(payload);
}

export async function clearCartService() {
  const payload = await apiRequest('/api/cart/clear', {
    method: 'DELETE',
  });
  return normalizeCart(payload || { items: [], subtotal: 0, total: 0 });
}
