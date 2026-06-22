function formatMoney(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function typeLabel(type = "") {
  return String(type).toLowerCase() === "percent" ? "Pourcentage" : "Montant fixe";
}

export default function AdminCouponsTable({
  coupons = [],
  busyCouponId = null,
  onEdit,
  onDelete,
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
            {["Code", "Type", "Valeur", "Usage", "Expiration", "Statut", "Description", "Actions"].map(
              (heading) => (
                <th key={heading} style={th}>
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {coupons.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ padding: 22, textAlign: "center", color: "#64748b" }}>
                Aucun coupon enregistré.
              </td>
            </tr>
          ) : (
            coupons.map((coupon) => {
              const isBusy = Number(busyCouponId) === Number(coupon.id);

              return (
                <tr key={coupon.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={td}>
                    <strong style={{ color: "#0f172a" }}>{coupon.code || "—"}</strong>
                  </td>

                  <td style={td}>{typeLabel(coupon.type)}</td>

                  <td style={td}>
                    {String(coupon.type).toLowerCase() === "percent"
                      ? `${coupon.value}%`
                      : formatMoney(coupon.value)}
                  </td>

                  <td style={td}>
                    {coupon.used_count || 0}
                    {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""}
                  </td>

                  <td style={td}>{formatDate(coupon.expires_at)}</td>

                  <td style={td}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: 999,
                        padding: "6px 10px",
                        fontSize: 13,
                        fontWeight: 700,
                        background: coupon.is_active ? "#dcfce7" : "#fee2e2",
                        color: coupon.is_active ? "#166534" : "#b91c1c",
                      }}
                    >
                      {coupon.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>

                  <td style={td}>{coupon.description || "—"}</td>

                  <td style={td}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="outline-button"
                        disabled={isBusy}
                        onClick={() => onEdit(coupon)}
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        style={{
                          ...dangerButton,
                          opacity: isBusy ? 0.6 : 1,
                        }}
                        onClick={() => onDelete(coupon)}
                      >
                        Supprimer
                      </button>
                    </div>
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

const th = {
  textAlign: "left",
  padding: "14px 12px",
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "#64748b",
};

const td = {
  padding: "16px 12px",
  verticalAlign: "middle",
  color: "#334155",
};

const dangerButton = {
  border: "none",
  background: "#fee2e2",
  color: "#991b1b",
  padding: "10px 14px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 700,
};
