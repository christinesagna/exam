export default function Pagination({
  currentPage = 1,
  lastPage = 1,
  onPageChange,
}) {
  if (lastPage <= 1) return null;

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(lastPage, currentPage + 2);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        marginTop: "24px",
        flexWrap: "wrap",
      }}
    >
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        style={btnStyle(false)}
      >
        Précédent
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange?.(1)} style={btnStyle(currentPage === 1)}>
            1
          </button>
          {start > 2 && <span>...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange?.(page)}
          style={btnStyle(page === currentPage)}
        >
          {page}
        </button>
      ))}

      {end < lastPage && (
        <>
          {end < lastPage - 1 && <span>...</span>}
          <button
            onClick={() => onPageChange?.(lastPage)}
            style={btnStyle(currentPage === lastPage)}
          >
            {lastPage}
          </button>
        </>
      )}

      <button
        disabled={currentPage === lastPage}
        onClick={() => onPageChange?.(currentPage + 1)}
        style={btnStyle(false)}
      >
        Suivant
      </button>
    </div>
  );
}

function btnStyle(active) {
  return {
    padding: "8px 12px",
    border: active ? "1px solid #2563eb" : "1px solid #d1d5db",
    borderRadius: "8px",
    background: active ? "#2563eb" : "#fff",
    color: active ? "#fff" : "#111827",
    cursor: "pointer",
  };
}
