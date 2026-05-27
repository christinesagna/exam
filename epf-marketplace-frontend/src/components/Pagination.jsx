export default function Pagination({ currentPage, lastPage, onPageChange }) {
  if (!lastPage || lastPage <= 1) return null;
 
  // Calcul de la fenêtre de pages affichées (max 5)
  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(lastPage, currentPage + delta);
    for (let i = left; i <= right; i++) pages.push(i);
    return pages;
  };
 
  const pages = getPages();
 
  return (
    <nav aria-label="Pagination" style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {/* Précédent */}
      <PageBtn
        label="←"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
 
      {/* Première page si écart */}
      {pages[0] > 1 && (
        <>
          <PageBtn label="1" onClick={() => onPageChange(1)} />
          {pages[0] > 2 && <span style={{ padding: "0 4px", color: "#9ca3af" }}>…</span>}
        </>
      )}
 
      {/* Pages de la fenêtre */}
      {pages.map((p) => (
        <PageBtn
          key={p}
          label={String(p)}
          active={p === currentPage}
          onClick={() => onPageChange(p)}
        />
      ))}
 
      {/* Dernière page si écart */}
      {pages[pages.length - 1] < lastPage && (
        <>
          {pages[pages.length - 1] < lastPage - 1 && (
            <span style={{ padding: "0 4px", color: "#9ca3af" }}>…</span>
          )}
          <PageBtn label={String(lastPage)} onClick={() => onPageChange(lastPage)} />
        </>
      )}
 
      {/* Suivant */}
      <PageBtn
        label="→"
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </nav>
  );
}
 
function PageBtn({ label, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 36,
        height: 36,
        padding: "0 10px",
        border: active ? "2px solid #2563eb" : "1px solid #e5e7eb",
        borderRadius: 8,
        background: active ? "#2563eb" : "#fff",
        color: active ? "#fff" : disabled ? "#d1d5db" : "#111",
        fontSize: 13,
        fontWeight: active ? 700 : 400,
        cursor: disabled ? "default" : "pointer",
        transition: "background .15s",
      }}
    >
      {label}
    </button>
  );
}
