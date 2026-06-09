function ErrorMessage({ message = 'Une erreur est survenue.', onClose }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between items-center">
      <p className="text-red-700 text-sm">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-700 font-bold"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
