import { Link } from 'react-router-dom';

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && actionTo ? (
        <Link className="btn btn-primary" to={actionTo}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
