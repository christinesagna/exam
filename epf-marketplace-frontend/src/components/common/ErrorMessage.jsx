export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="error-message" role="alert" aria-live="polite">
      <p>{message}</p>
    </div>
  );
}
