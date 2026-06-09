import { apiRequest } from './http';

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeOrderLine(line = {}) {
  const product = line.product || {};
  const quantity = toNumber(line.quantity, 1);
  const unitPrice = toNumber(line.unit_price ?? line.price ?? product.price, 0);

  return {
    id: line.id ?? Math.random().toString(36).slice(2),
    productId: product.id ?? line.product_id ?? null,
    name: product.name ?? line.name ?? 'Produit',
    quantity,
    unitPrice,
    subtotal: toNumber(line.subtotal, quantity * unitPrice),
  };
}

export function normalizeOrder(order = {}) {
  const lines = Array.isArray(order.items || order.lines)
    ? (order.items || order.lines).map(normalizeOrderLine)
    : [];

  return {
    id: order.id ?? order.order_id ?? '',
    reference: order.reference ?? order.code ?? `CMD-${order.id ?? '---'}`,
    status: String(order.status ?? 'pending').toLowerCase(),
    total: toNumber(order.total ?? order.amount, lines.reduce((sum, line) => sum + line.subtotal, 0)),
    createdAt: order.created_at ?? order.createdAt ?? '',
    shippingAddress: order.shipping_address ?? order.shippingAddress ?? '',
    billingAddress: order.billing_address ?? order.billingAddress ?? '',
    note: order.note ?? order.notes ?? '',
    lines,
    raw: order,
  };
}

function extractOrder(payload) {
  return normalizeOrder(payload?.data ?? payload?.order ?? payload);
}

export async function createOrder(orderPayload) {
  const payload = await apiRequest('/api/orders', {
    method: 'POST',
    body: orderPayload,
  });
  return extractOrder(payload);
}

export async function getMyOrders() {
  const payload = await apiRequest('/api/orders/my-orders');
  const list = payload?.data ?? payload?.orders ?? payload;
  return Array.isArray(list) ? list.map(normalizeOrder) : [];
}

export async function getOrderById(orderId) {
  const payload = await apiRequest(`/api/orders/${orderId}`);
  return extractOrder(payload);
}

export async function cancelOrder(orderId) {
  const payload = await apiRequest(`/api/orders/${orderId}/cancel`, {
    method: 'POST',
  });
  return extractOrder(payload);
}
