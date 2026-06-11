import { Link } from "react-router-dom";

const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

export default function ProductTable({ products = [], onDelete }) {
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
            <th style={th}>Produit</th>
            <th style={th}>Prix</th>
            <th style={th}>Stock</th>
            <th style={th}>Statut</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{ padding: 20, textAlign: "center", color: "#6b7280" }}
              >
                Aucun produit
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td style={td}>{product.title ?? product.name}</td>
                <td style={td}>{money.format(Number(product.price ?? 0))}</td>
                <td style={td}>{product.quantity ?? product.stock ?? 0}</td>
                <td style={td}>{product.status ?? "draft"}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link to={`/seller/products/${product.id}/edit`}>
                      Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      style={dangerBtn}
                    >
                      Supprimer
                    </button>
                  </div>
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
};

const dangerBtn = {
  background: "#fee2e2",
  color: "#991b1b",
  border: "none",
  padding: "8px 10px",
  borderRadius: 8,
  cursor: "pointer",
};
