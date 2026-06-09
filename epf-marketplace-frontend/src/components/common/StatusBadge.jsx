const LABELS = {
  pending: 'En attente',
  paid: 'Payée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  completed: 'Terminée',
};

export default function StatusBadge({ status = 'pending' }) {
  const normalized = String(status).toLowerCase();
  return (
    <span className={`status-badge ${normalized}`}>
      {LABELS[normalized] || normalized}
    </span>
  );
}
