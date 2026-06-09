import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return 'Date indisponible';
  return new Date(value).toLocaleString('fr-FR');
}

export default function OrderCard({ order }) {
  return (
    <article className="card order-card">
      <div className="order-card-head">
        <div>
          <h3>{order.reference}</h3>
          <p className="muted">Créée le {formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="order-card-meta">
        <span>{order.lines.length} ligne(s)</span>
        <strong>{formatPrice(order.total)}</strong>
      </div>

      <Link to={`/buyer/orders/${order.id}`} className="btn btn-secondary">
        Voir le détail
      </Link>
    </article>
  );
}
