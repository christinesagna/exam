export default function SellerMetricCard({ title, value, hint, accent = "#2563eb" }) {
  return (
    <article
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: accent,
          marginBottom: 16,
        }}
      />
      <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>{title}</p>
      <h3 style={{ margin: "8px 0 6px", fontSize: 28, color: "#0f172a" }}>{value}</h3>
      <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>{hint}</p>
    </article>
  );
}
