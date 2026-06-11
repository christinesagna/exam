const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("fr-FR") : "—";

const STATUS_OPTIONS = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

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
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                style={{ padding: 20, textAlign: "center", color: "#6b7280" }}
              >
                Aucune commande trouvée
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td style={td}>{order.reference}</td>
                <td style={td}>{order.customer?.name ?? "Client"}</td>
                <td style={td}>{formatDate(order.createdAt)}</td>
                <td style={td}>{order.items?.length ?? 0}</td>
                <td style={td}>{money.format(order.total || 0)}</td>
                <td style={td}>
                  {readOnly ? (
                    <span>{order.status}</span>
                  ) : (
                    <select
                      value={order.status}
                      disabled={loadingId === order.id}
                      onChange={(e) => onStatusChange(order, e.target.value)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid #d1d5db",
                      }}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

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
