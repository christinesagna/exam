export default function SellerStatsCards({ cards = [] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 24,
      }}
    >
      {cards.map((card) => (
        <article
          key={card.label}
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 18,
          }}
        >
          <div style={{ color: "#6b7280", fontSize: 14 }}>{card.label}</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>
            {card.value}
          </div>
        </article>
      ))}
    </div>
  );
}