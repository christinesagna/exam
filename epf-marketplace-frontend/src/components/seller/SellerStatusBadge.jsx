const palette = {
  pending: { bg: "#fef3c7", color: "#92400e", label: "En attente" },
  confirmed: { bg: "#dbeafe", color: "#1d4ed8", label: "Confirmée" },
  shipped: { bg: "#e0e7ff", color: "#4338ca", label: "Expédiée" },
  delivered: { bg: "#dcfce7", color: "#166534", label: "Livrée" },
  cancelled: { bg: "#fee2e2", color: "#991b1b", label: "Annulée" },
  mixed: { bg: "#f1f5f9", color: "#334155", label: "Statuts mixtes" },
};

export default function SellerStatusBadge({ status }) {
  const theme = palette[status] || { bg: "#e5e7eb", color: "#1f2937", label: status || "Inconnu" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 10px",
        borderRadius: 999,
        background: theme.bg,
        color: theme.color,
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {theme.label}
    </span>
  );
}
