import SellerStatusBadge from "./SellerStatusBadge";

function getSellerItemStatus(order) {
  const statuses = [...new Set((order?.items || []).map((item) => item.status).filter(Boolean))];
  if (statuses.length === 1) return statuses[0];
  if (statuses.length > 1) return "mixed";
  return order?.status || "pending";
}

function nextActionForStatus(status) {
  const map = {
    pending: { label: "Confirmer", nextStatus: "confirmed" },
    confirmed: { label: "Expédier", nextStatus: "shipped" },
    shipped: { label: "Livrer", nextStatus: "delivered" },
  };
  return map[status] || null;
}

function formatAmount(value) {
  const numeric = Number.parseFloat(value || 0);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number.isNaN(numeric) ? 0 : numeric);
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("fr-FR");
}

export default function SellerOrdersTable({ orders, loading, onAdvanceStatus, updatingOrderId }) {
  if (loading) {
    return <p>Chargement des commandes vendeur...</p>;
  }

  if (!orders.length) {
    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 24,
          color: "#64748b",
        }}
      >
        Aucune commande reçue pour ce filtre.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {orders.map((order) => {
        const sellerStatus = getSellerItemStatus(order);
        const action = nextActionForStatus(sellerStatus);

        return (
          <article
            key={order.id}
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 20, color: "#0f172a" }}>{order.order_number}</h3>
                <p style={{ margin: "8px 0 0", color: "#475569" }}>
                  Acheteur : <strong>{order.buyer?.name || "Inconnu"}</strong>
                  {order.buyer?.phone ? ` · ${order.buyer.phone}` : ""}
                </p>
                <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 14 }}>
                  Créée le {formatDate(order.created_at)}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <SellerStatusBadge status={sellerStatus} />
                <strong style={{ fontSize: 18, color: "#0f172a" }}>{formatAmount(order.total_amount)}</strong>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: "0 0 10px", fontSize: 14, color: "#64748b", fontWeight: 700 }}>
                Articles du vendeur
              </p>
              <div style={{ display: "grid", gap: 10 }}>
                {(order.items || []).map((item, index) => (
                  <div
                    key={`${order.id}-${index}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "#f8fafc",
                    }}
                  >
                    <div>
                      <strong style={{ color: "#0f172a" }}>{item.product?.title || "Produit supprimé"}</strong>
                      <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 14 }}>
                        Quantité : {item.quantity}
                      </p>
                    </div>
                    <SellerStatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </div>

            {action ? (
              <button
                type="button"
                onClick={() => onAdvanceStatus(order.id, action.nextStatus)}
                disabled={updatingOrderId === order.id}
                style={{
                  border: "none",
                  background: "#2563eb",
                  color: "#ffffff",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: updatingOrderId === order.id ? "not-allowed" : "pointer",
                  opacity: updatingOrderId === order.id ? 0.6 : 1,
                }}
              >
                {updatingOrderId === order.id ? "Mise à jour..." : action.label}
              </button>
            ) : (
              <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
                Aucun changement de statut disponible pour cette commande.
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
