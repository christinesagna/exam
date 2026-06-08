export default function EmptyState({ title = "Aucun résultat", message = "" }) {
  return (
    <div
      style={{
        padding: "60px 20px",
        textAlign: "center",
        background: "#f8fafc",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
      }}
    >
      <h2 style={{ color: "#1e293b", marginBottom: 8 }}>{title}</h2>
      {message && <p style={{ color: "#64748b", margin: 0 }}>{message}</p>}
    </div>
  );
}
