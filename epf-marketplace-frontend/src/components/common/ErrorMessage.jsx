function ErrorMessage({ message = 'Une erreur est survenue.' }) {
  return <p style={{ color: 'red' }}>{message}</p>;
}

export default ErrorMessage;
