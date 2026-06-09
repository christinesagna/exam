import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CartItemRow from '../../components/cart/CartItemRow';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useCart } from '../../hooks/useCart';

export default function CartPage() {
  const {
    cart,
    loading,
    submitting,
    error,
    couponCode,
    setCouponCode,
    subtotal,
    total,
    itemCount,
    updateItemQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const items = useMemo(() => cart.items || [], [cart.items]);

  async function handleQuantityChange(itemId, nextQuantity) {
    if (!Number.isFinite(nextQuantity) || nextQuantity < 1) return;
    await updateItemQuantity(itemId, nextQuantity);
  }

  async function handleRemove(itemId) {
    await removeItem(itemId);
  }

  async function handleClear() {
    await clearCart();
  }

  if (loading) {
    return <LoadingSpinner label="Chargement du panier..." />;
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Sprint 3 · Buyer</p>
          <h1>Mon panier</h1>
          <p className="muted">Ajout, modification de quantité, suppression et vidage complet.</p>
        </div>
        <Link className="btn btn-secondary" to="/products">
          Continuer les achats
        </Link>
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}

      {items.length === 0 ? (
        <EmptyState
          title="Votre panier est vide"
          description="Ajoutez des produits depuis le catalogue pour démarrer votre commande."
          actionLabel="Aller au catalogue"
          actionTo="/products"
        />
      ) : (
        <div className="content-grid">
          <div className="stack-list">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                disabled={submitting}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <CartSummary
            itemCount={itemCount}
            subtotal={subtotal}
            total={total}
            couponCode={couponCode}
            onCouponChange={setCouponCode}
            onClear={handleClear}
            disabled={submitting}
          />
        </div>
      )}
    </section>
  );
}
