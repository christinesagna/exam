import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  addToCart,
  clearCartService,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../services/cart.service';
import { createOrder } from '../services/orders.service';
import { getAuthToken } from '../services/http';

const CART_STORAGE_KEY = 'epf-marketplace-cart';

const initialCart = {
  id: 'current-cart',
  items: [],
  subtotal: 0,
  total: 0,
  itemCount: 0,
  raw: null,
};

export const CartContext = createContext(null);

function readCartFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialCart;
  } catch {
    return initialCart;
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCartFromStorage);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const refreshCart = useCallback(async () => {
    if (!getAuthToken()) {
      setCart(readCartFromStorage());
      return initialCart;
    }

    setLoading(true);
    setError('');
    try {
      const freshCart = await getCart();
      setCart(freshCart);
      return freshCart;
    } catch (err) {
      setError(err.message || 'Impossible de charger le panier.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (getAuthToken()) {
      refreshCart().catch(() => {});
    }
  }, [refreshCart]);

  useEffect(() => {
    function handleUnauthorized() {
      setCart(initialCart);
      setCouponCode('');
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const addItem = useCallback(async (productId, quantity = 1) => {
    setSubmitting(true);
    setError('');
    try {
      const nextCart = await addToCart({ productId, quantity });
      setCart(nextCart);
      return nextCart;
    } catch (err) {
      setError(err.message || 'Ajout au panier impossible.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const updateItemQuantity = useCallback(async (cartItemId, quantity) => {
    setSubmitting(true);
    setError('');
    try {
      const nextCart = await updateCartItem(cartItemId, quantity);
      setCart(nextCart);
      return nextCart;
    } catch (err) {
      setError(err.message || 'Mise à jour impossible.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const removeItem = useCallback(async (cartItemId) => {
    setSubmitting(true);
    setError('');
    try {
      const nextCart = await removeCartItem(cartItemId);
      setCart(nextCart);
      return nextCart;
    } catch (err) {
      setError(err.message || 'Suppression impossible.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    setSubmitting(true);
    setError('');
    try {
      const nextCart = await clearCartService();
      setCart(nextCart);
      return nextCart;
    } catch (err) {
      setError(err.message || 'Vidage du panier impossible.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const placeOrder = useCallback(async ({ shippingAddress, billingAddress, note }) => {
    setSubmitting(true);
    setError('');

    const payload = {
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      note,
    };

    if (couponCode.trim()) {
      payload.coupon_code = couponCode.trim();
    }

    try {
      const order = await createOrder(payload);
      setCart(initialCart);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(initialCart));
      return order;
    } catch (err) {
      setError(err.message || 'Création de commande impossible.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [couponCode]);

  const totals = useMemo(() => ({
    subtotal: Number(cart.subtotal || 0),
    total: Number(cart.total || cart.subtotal || 0),
    itemCount: Number(cart.itemCount || 0),
  }), [cart]);

  const value = useMemo(() => ({
    cart,
    loading,
    submitting,
    error,
    couponCode,
    setCouponCode,
    subtotal: totals.subtotal,
    total: totals.total,
    itemCount: totals.itemCount,
    refreshCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    placeOrder,
  }), [
    addItem,
    cart,
    clearCart,
    couponCode,
    error,
    loading,
    placeOrder,
    refreshCart,
    removeItem,
    submitting,
    totals.itemCount,
    totals.subtotal,
    totals.total,
    updateItemQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
