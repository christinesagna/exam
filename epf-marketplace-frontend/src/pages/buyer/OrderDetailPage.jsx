import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import OrderLineTable from '../../components/orders/OrderLineTable';
import { cancelOrder, getOrderById } from '../../services/orders.service';

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadOrder() {
      setLoading(true);
      setError('');
      try {
        const data = await getOrderById(orderId);
        if (!ignore) setOrder(data);
      } catch (err) {
        if (!ignore) setError(err.message || 'Impossible de charger la commande.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadOrder();
    return () => {
      ignore = true;
    };
  }, [orderId]);

  async function handleCancel() {
    if (!order) return;
    setActionLoading(true);
    setError('');
    try {
      const updated = await cancelOrder(order.id);
      setOrder(updated);
    } catch (err) {
      setError(err.message || 'Annulation impossible.');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Chargement du détail..." />;
  }

  if (!order) {
    return (
      <section className="page-section narrow-page">
        <div className="alert alert-error">Commande introuvable.</div>
        <Link to="/buyer/orders" className="btn btn-secondary">Retour à mes commandes</Link>
      </section>
    );
  }

  return (
    <section className="page-section narrow-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Sprint 3 · Buyer</p>
          <h1>Détail de commande</h1>
          <p className="muted">Référence : {order.reference}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}

      <div className="card detail-grid">
        <div>
          <h3>Informations</h3>
          <p><strong>Adresse de livraison :</strong><br />{order.shippingAddress || 'Non fournie'}</p>
          <p><strong>Adresse de facturation :</strong><br />{order.billingAddress || 'Non fournie'}</p>
          {order.note ? <p><strong>Note :</strong><br />{order.note}</p> : null}
        </div>

        <div>
          <h3>Montant</h3>
          <p className="big-price">{formatPrice(order.total)}</p>
          <div className="stack-actions">
            {order.status === 'pending' ? (
              <button type="button" className="btn btn-danger" disabled={actionLoading} onClick={handleCancel}>
                {actionLoading ? 'Annulation...' : 'Annuler la commande'}
              </button>
            ) : null}
            <Link to="/buyer/orders" className="btn btn-secondary">Retour à mes commandes</Link>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Lignes de commande</h3>
        <OrderLineTable lines={order.lines} />
      </div>
    </section>
  );
}
