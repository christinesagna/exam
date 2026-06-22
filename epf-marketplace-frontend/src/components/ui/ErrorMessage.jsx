import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function ErrorMessage({ message = "Une erreur est survenue.", onClose }) {
  if (!message) return null;

  return (
    <div
      style={{
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#991b1b",
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
      }}
    >
      <p style={{ margin: 0, fontSize: 14 }}>{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            color: "#991b1b",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
