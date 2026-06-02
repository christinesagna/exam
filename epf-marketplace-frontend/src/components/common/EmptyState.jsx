export default function EmptyState({
  title = "Aucune donnée",
  message = "Il n’y a rien à afficher pour le moment.",
  action = null,
}) {
  return (
    <div
      style={{
        padding: "32px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        background: "#f9fafb",
        textAlign: "center",
      }}
    >
      <h3 style={{ marginBottom: "8px" }}>{title}</h3>
      <p style={{ marginBottom: "16px", color: "#6b7280" }}>{message}</p>
      {action}
    </div>
  );
}
