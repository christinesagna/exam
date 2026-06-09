export default function LoadingSpinner({ label = 'Chargement...' }) {
  return (
    <div className="spinner-box" role="status" aria-live="polite">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}
