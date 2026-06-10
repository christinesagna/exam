import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export const CartContext = createContext(null);

const CART_STORAGE_KEY = "epf_marketplace_cart_snapshot";

const EMPTY_CART = {
  id: null,
  items: [],
  subtotal: 0,
  total: 0,
  itemCount: 0,
};

function saveCartSnapshot(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function loadCartSnapshot() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function normalizeCartItem(item) {
  const product = item?.product || item?.product_data || item?.item || null;
  const quantity = Number(item?.quantity ?? item?.qty ?? 1);
  const unitPrice = Number(
    item?.unit_price ??
      item?.price ??
      product?.effective_price ??
      product?.price ??
      0
  );

  return {
    id: item?.id ?? item?.cart_item_id ?? product?.id,
    product_id: item?.product_id ?? product?.id,
    quantity,
    unitPrice,
    lineTotal: Number(item?.line_total ?? unitPrice * quantity),
    product,
  };
}

function normalizeCartResponse(payload) {
  const root = payload?.data ?? payload ?? {};
  const cart = root?.cart ?? root?.data ?? root;

  const rawItems =
    cart?.items ??
    cart?.cart_items ??
    root?.items ??
    root?.cart_items ??
    [];

  const items = Array.isArray(rawItems) ? rawItems.map(normalizeCartItem) : [];

  const subtotal =
    Number(cart?.subtotal ?? root?.subtotal) ||
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const total =
    Number(cart?.total ?? root?.total) ||
    Number(cart?.grand_total ?? root?.grand_total) ||
    subtotal;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart?.id ?? root?.id ?? null,
    items,
    subtotal,
    total,
    itemCount,
  };
}

export function CartProvider({ children }) {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const toast = useToast();

  const [cart, setCart] = useState(loadCartSnapshot());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const isBuyer = user?.role === "buyer";

  const applyCart = useCallback((nextCart) => {
    setCart(nextCart);
    saveCartSnapshot(nextCart);
  }, []);

  const resetCartLocal = useCallback(() => {
    applyCart(EMPTY_CART);
  }, [applyCart]);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated || !isBuyer) {
      resetCartLocal();
      setLoading(false);
      return EMPTY_CART;
    }

    try {
      setSyncing(true);
      const data = await cartService.getCart();
      const normalized = normalizeCartResponse(data);
      applyCart(normalized);
      return normalized;
    } catch (error) {
      resetCartLocal();
      throw error;
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [applyCart, isAuthenticated, isBuyer, resetCartLocal]);

  useEffect(() => {
    if (authLoading) return;
    loadCart().catch(() => {});
  }, [authLoading, loadCart]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!isAuthenticated || !isBuyer) {
        toast.error("Connecte-toi avec un compte buyer pour utiliser le panier.");
        throw new Error("Unauthorized cart access");
      }

      try {
        setSyncing(true);
        await cartService.addToCart({
          product_id: productId,
          quantity,
        });
        const nextCart = await loadCart();
        toast.success("Produit ajouté au panier.");
        return nextCart;
      } finally {
        setSyncing(false);
      }
    },
    [isAuthenticated, isBuyer, loadCart, toast]
  );

  const updateQuantity = useCallback(
    async (cartItemId, quantity) => {
      if (quantity <= 0) {
        return removeItem(cartItemId);
      }

      try {
        setSyncing(true);
        await cartService.updateCartItem(cartItemId, { quantity });
        const nextCart = await loadCart();
        toast.success("Quantité mise à jour.");
        return nextCart;
      } finally {
        setSyncing(false);
      }
    },
    [loadCart, toast]
  );

  const removeItem = useCallback(
    async (cartItemId) => {
      try {
        setSyncing(true);
        await cartService.removeCartItem(cartItemId);
        const nextCart = await loadCart();
        toast.success("Article retiré du panier.");
        return nextCart;
      } finally {
        setSyncing(false);
      }
    },
    [loadCart, toast]
  );

  const clearCart = useCallback(
    async ({ silent = false } = {}) => {
      try {
        setSyncing(true);
        await cartService.clearCart();
      } catch {
        // On continue quand même pour vider le front
      } finally {
        resetCartLocal();
        setSyncing(false);
        if (!silent) {
          toast.success("Panier vidé.");
        }
      }
    },
    [resetCartLocal, toast]
  );

  const value = useMemo(
    () => ({
      cart,
      loading,
      syncing,
      itemCount: cart.itemCount,
      subtotal: cart.subtotal,
      total: cart.total,
      loadCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      resetCartLocal,
    }),
    [cart, loading, syncing, loadCart, addToCart, updateQuantity, removeItem, clearCart, resetCartLocal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
