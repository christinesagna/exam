import { Link } from 'react-router-dom';

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function CartSummary({
  itemCount,
  subtotal,
  total,
  couponCode,
  onCouponChange,
  onClear,
  disabled,
  checkoutPath = '/buyer/checkout',
}) {
  return (
    <aside className="card summary-card">
      <h3>Résumé du panier</h3>

      <dl className="summary-grid">
        <div>
          <dt>Articles</dt>
          <dd>{itemCount}</dd>
        </div>
        <div>
          <dt>Sous-total</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Total estimé</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      <label className="field-block">
        Coupon (optionnel)
        <input
          type="text"
          value={couponCode}
          disabled={disabled}
          onChange={(event) => onCouponChange(event.target.value)}
          placeholder="Ex. EPF10"
        />
        <small>Le code est transmis au checkout si l’API le supporte.</small>
      </label>

      <div className="stack-actions">
        <Link to={checkoutPath} className="btn btn-primary" aria-disabled={disabled || itemCount === 0}>
          Passer la commande
        </Link>
        <button type="button" className="btn btn-secondary" disabled={disabled || itemCount === 0} onClick={onClear}>
          Vider le panier
        </button>
      </div>
    </aside>
  );
}
