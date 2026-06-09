import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../hooks/useCart';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, itemCount, total, couponCode, placeOrder, submitting, error } = useCart();
  const [form, setForm] = useState({
    shippingAddress: '',
    billingAddress: '',
    sameAsShipping: true,
    note: '',
  });
  const [localError, setLocalError] = useState('');

  function updateField(name, value) {
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === 'shippingAddress' && current.sameAsShipping) {
        next.billingAddress = value;
      }
      return next;
    });
  }

  function handleSameAddressChange(checked) {
    setForm((current) => ({
      ...current,
      sameAsShipping: checked,
      billingAddress: checked ? current.shippingAddress : current.billingAddress,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError('');

    const shippingAddress = form.shippingAddress.trim();
    const billingAddress = (form.sameAsShipping ? form.shippingAddress : form.billingAddress).trim();

    if (!shippingAddress || !billingAddress) {
      setLocalError('Les adresses de livraison et de facturation sont obligatoires.');
      return;
    }

    try {
      const order = await placeOrder({
        shippingAddress,
        billingAddress,
        note: form.note.trim(),
        couponCode,
      });
      navigate(`/buyer/orders/${order.id}`);
    } catch {
      // l'erreur globale est gérée par le contexte
    }
  }

  if (!cart.items?.length) {
    return (
      <EmptyState
        title="Aucun article à commander"
        description="Votre checkout est vide. Retournez au panier pour ajouter des produits."
        actionLabel="Retour au panier"
        actionTo="/buyer/cart"
      />
    );
  }

  return (
    <section className="page-section narrow-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Sprint 3 · Buyer</p>
          <h1>Checkout</h1>
          <p className="muted">Validation du panier et passage de commande.</p>
        </div>
      </div>

      {(localError || error) ? <div className="alert alert-error">{localError || error}</div> : null}

      <div className="card checkout-layout">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Adresse de livraison
            <textarea
              value={form.shippingAddress}
              onChange={(event) => updateField('shippingAddress', event.target.value)}
              rows="4"
              placeholder="Ville, quartier, téléphone, précision..."
            />
          </label>

          <label className="inline-checkbox">
            <input
              type="checkbox"
              checked={form.sameAsShipping}
              onChange={(event) => handleSameAddressChange(event.target.checked)}
            />
            Facturation identique à la livraison
          </label>

          {!form.sameAsShipping ? (
            <label>
              Adresse de facturation
              <textarea
                value={form.billingAddress}
                onChange={(event) => updateField('billingAddress', event.target.value)}
                rows="4"
                placeholder="Adresse de facturation"
              />
            </label>
          ) : null}

          <label>
            Note de commande (optionnel)
            <textarea
              value={form.note}
              onChange={(event) => updateField('note', event.target.value)}
              rows="3"
              placeholder="Informations utiles pour la livraison"
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={submitting || itemCount === 0}>
            {submitting ? 'Validation...' : 'Confirmer la commande'}
          </button>
        </form>

        <aside className="checkout-summary">
          <h3>Récapitulatif</h3>
          <p><strong>{itemCount}</strong> article(s)</p>
          <ul className="compact-list">
            {cart.items.map((item) => (
              <li key={item.id}>
                <span>{item.name} × {item.quantity}</span>
                <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(item.subtotal)}</strong>
              </li>
            ))}
          </ul>
          {couponCode ? <p className="muted">Coupon saisi : <strong>{couponCode}</strong></p> : null}
          <p className="checkout-total">
            Total estimé :
            <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(total)}</strong>
          </p>
        </aside>
      </div>
    </section>
  );
}
