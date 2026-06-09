import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import OrderCard from '../../components/orders/OrderCard';
import { getMyOrders } from '../../services/orders.service';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      setLoading(true);
      setError('');
      try {
        const data = await getMyOrders();
        if (!ignore) setOrders(data);
      } catch (err) {
        if (!ignore) setError(err.message || 'Chargement des commandes impossible.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner label="Chargement des commandes..." />;
  }

  return (
    <section className="page-section narrow-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Sprint 3 · Buyer</p>
          <h1>Mes commandes</h1>
          <p className="muted">Historique complet et accès au détail d’une commande.</p>
        </div>
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}

      {!orders.length ? (
        <EmptyState
          title="Aucune commande pour le moment"
          description="Dès qu’une commande est validée, elle apparaîtra ici."
          actionLabel="Voir le panier"
          actionTo="/buyer/cart"
        />
      ) : (
        <div className="stack-list">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}
