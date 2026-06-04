export default function Pagination({ currentPage = 1, lastPage = 1, onPageChange }) {
  if (lastPage <= 1) return null;

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 24, alignItems: "center" }}>
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        style={buttonStyle}
      >
        Précédent
      </button>
      <span>
        Page {currentPage} sur {lastPage}
      </span>
      <button
        type="button"
        disabled={currentPage >= lastPage}
        onClick={() => onPageChange?.(currentPage + 1)}
        style={buttonStyle}
      >
        Suivant
      </button>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  background: "#fff",
  cursor: "pointer",
};
