import { useEffect, useMemo, useState } from "react";

const BASE_STATUS_OPTIONS = ["draft", "published", "archived", "rejected", "sold"];

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

function statusLabel(status = "") {
  const map = {
    draft: "Brouillon",
    published: "Publié",
    archived: "Archivé",
    rejected: "Rejeté",
    sold: "Vendu",
  };

  return map[String(status).toLowerCase()] || status || "—";
}

function statusStyle(status = "") {
  const normalized = String(status).toLowerCase();

  if (normalized === "published") {
    return { background: "#dcfce7", color: "#166534" };
  }

  if (normalized === "draft") {
    return { background: "#fef3c7", color: "#92400e" };
  }

  if (normalized === "archived") {
    return { background: "#e2e8f0", color: "#334155" };
  }

  if (normalized === "rejected") {
    return { background: "#fee2e2", color: "#b91c1c" };
  }

  if (normalized === "sold") {
    return { background: "#dbeafe", color: "#1d4ed8" };
  }

  return { background: "#f1f5f9", color: "#475569" };
}

function ProductRow({ product, busyProductId, onStatusChange, onForceDelete }) {
  const [nextStatus, setNextStatus] = useState(product?.status || "draft");
  const isBusy = Number(busyProductId) === Number(product?.id);

  useEffect(() => {
    setNextStatus(product?.status || "draft");
  }, [product?.status]);

  const statusOptions = useMemo(() => {
    return [...new Set([product?.status, ...BASE_STATUS_OPTIONS].filter(Boolean))];
  }, [product?.status]);

  return (
    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
      <td style={td}>
        <div style={{ display: "grid", gap: 4 }}>
          <strong style={{ color: "#0f172a" }}>{product?.title || product?.name || "Sans titre"}</strong>
          <span style={{ color: "#64748b", fontSize: 13 }}>
            ID: {product?.id ?? "—"}
          </span>
        </div>
      </td>

      <td style={td}>{product?.seller?.name || "—"}</td>
      <td style={td}>{product?.category?.name || "—"}</td>
      <td style={td}>{formatMoney(product?.price)}</td>
      <td style={td}>{product?.quantity ?? product?.stock ?? 0}</td>

      <td style={td}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 999,
            padding: "6px 10px",
            fontSize: 13,
            fontWeight: 700,
            ...statusStyle(product?.status),
          }}
        >
          {statusLabel(product?.status)}
        </span>
      </td>

      <td style={td}>{formatDate(product?.created_at)}</td>

      <td style={td}>
        <div style={{ display: "grid", gap: 10, minWidth: 240 }}>
          <select
            className="form-input"
            value={nextStatus}
            onChange={(event) => setNextStatus(event.target.value)}
            disabled={isBusy}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              className="outline-button"
              disabled={isBusy || nextStatus === product?.status}
              style={{ opacity: isBusy || nextStatus === product?.status ? 0.6 : 1 }}
              onClick={() => onStatusChange(product, nextStatus)}
            >
              {isBusy ? "Mise à jour..." : "Appliquer"}
            </button>

            <button
              type="button"
              disabled={isBusy}
              style={{
                ...dangerButton,
                opacity: isBusy ? 0.6 : 1,
              }}
              onClick={() => onForceDelete(product)}
            >
              Suppression forcée
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function AdminProductsTable({
  products = [],
  busyProductId = null,
  onStatusChange,
  onForceDelete,
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
            {["Produit", "Vendeur", "Catégorie", "Prix", "Stock", "Statut", "Création", "Actions"].map(
              (heading) => (
                <th key={heading} style={th}>
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ padding: 22, textAlign: "center", color: "#64748b" }}>
                Aucun produit trouvé.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                busyProductId={busyProductId}
                onStatusChange={onStatusChange}
                onForceDelete={onForceDelete}
              />
            ))
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
