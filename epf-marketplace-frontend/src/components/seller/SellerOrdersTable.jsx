

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("fr-FR") : "—";
 
const STATUS_LABELS = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};
 
// Transitions autorisées côté vendeur (alignées avec la logique backend)
const ALLOWED_TRANSITIONS = {
  pending:   ["pending", "confirmed", "cancelled"],
  confirmed: ["confirmed", "shipped", "cancelled"],
  shipped:   ["shipped", "delivered"],
  delivered: ["delivered"],
  cancelled: ["cancelled"],
};
 
export default function SellerOrdersTable({
  orders = [],
  onStatusChange,
  loadingId = null,
  readOnly = false,
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead style={{ background: "#f9fafb" }}>
          <tr>
            <th style={th}>Référence</th>
            <th style={th}>Client</th>
            <th style={th}>Date</th>
            <th style={th}>Articles</th>
            <th style={th}>Total</th>
            <th style={th}>Statut</th>
          </tr>
        </thead>
 
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                style={{
                  padding: 20,
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Aucune commande trouvée
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const currentStatus = order.status;
              const allowedStatuses =
                ALLOWED_TRANSITIONS[currentStatus] ?? [currentStatus];
              const isFinal =
                currentStatus === "delivered" || currentStatus === "cancelled";
 
              return (
                <tr
                  key={order.id}
                  style={{
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <td style={td}>{order.reference}</td>
 
                  <td style={td}>
                    {order.customer?.name ?? "Client"}
                  </td>
 
                  <td style={td}>
                    {formatDate(order.createdAt)}
                  </td>
 
                  <td style={td}>
                    {order.itemsCount ?? order.items?.length ?? 0}
                  </td>
 
                  <td style={td}>
                    {money.format(order.total || 0)}
                  </td>
 
                  <td style={td}>
                    {!readOnly && !isFinal ? (
                      <select
                        value={currentStatus}
                        disabled={loadingId === order.id}
                        onChange={(e) =>
                          onStatusChange(order, e.target.value)
                        }
                        style={{
                          padding: "8px 10px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          minWidth: 140,
                        }}
                      >
                        {allowedStatuses.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        style={{
                          padding: "5px 10px",
                          borderRadius: 8,
                          fontSize: 13,
                          background:
                            currentStatus === "delivered"
                              ? "#d1fae5"
                              : currentStatus === "cancelled"
                              ? "#fee2e2"
                              : "#f3f4f6",
                          color:
                            currentStatus === "delivered"
                              ? "#065f46"
                              : currentStatus === "cancelled"
                              ? "#991b1b"
                              : "#374151",
                        }}
                      >
                        {STATUS_LABELS[currentStatus] ?? currentStatus}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
 
const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});
 
const th = {
  textAlign: "left",
  padding: 14,
  fontSize: 13,
  color: "#6b7280",
};
 
const td = {
  padding: 14,
  verticalAlign: "middle",
};