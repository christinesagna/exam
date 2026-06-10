import { Link, useNavigate } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import { useCart } from "../../hooks/useCart";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    syncing,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (loading) return <Loader />;

  if (!cart.items.length) {
    return (
      <EmptyState
        title="Ton panier est vide"
        message="Ajoute des produits depuis le catalogue pour commencer ta commande."
      />
    );
  }

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ marginTop: 0 }}>Mon panier</h1>
          <p style={{ color: "#6b7280" }}>
            {cart.itemCount} article(s) • Total estimé : {Number(cart.total).toFixed(2)} FCFA
          </p>
        </div>

        <button
          onClick={() => clearCart()}
          disabled={syncing}
          style={{
            border: "1px solid #fecaca",
            background: "#fff",
            color: "#b91c1c",
            padding: "10px 14px",
            borderRadius: 10,
            cursor: "pointer",
            height: "fit-content",
          }}
        >
          Vider le panier
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 0.8fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {cart.items.map((item) => {
            const product = item.product || {};
            const image =
              product.thumbnail ||
              product.image ||
              product.images?.[0]?.url ||
              product.images?.[0] ||
              null;

            return (
              <article
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr auto",
                  gap: 16,
                  padding: 16,
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={product.title || product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ color: "#6b7280", fontSize: 12 }}>Pas d’image</span>
                  )}
                </div>

                <div>
                  <Link
                    to={`/products/${product.id || item.product_id}`}
                    style={{ textDecoration: "none", color: "#111827" }}
                  >
                    <h3 style={{ marginTop: 0 }}>
                      {product.title || product.name || `Produit #${item.product_id}`}
                    </h3>
                  </Link>

                  <p style={{ color: "#6b7280", margin: "6px 0" }}>
                    Prix unitaire : {Number(item.unitPrice).toFixed(2)} FCFA
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={syncing}
                      style={qtyBtnStyle}
                    >
                      -
                    </button>

                    <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={syncing}
                      style={qtyBtnStyle}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <strong>{Number(item.lineTotal).toFixed(2)} FCFA</strong>

                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={syncing}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#dc2626",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <aside
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 20,
            position: "sticky",
            top: 96,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Résumé</h2>

          <Row label="Sous-total" value={`${Number(cart.subtotal).toFixed(2)} FCFA`} />
          <Row label="Frais" value="0.00 FCFA" />
          <Row label="Total" value={`${Number(cart.total).toFixed(2)} FCFA`} bold />

          <button
            onClick={() => navigate("/checkout")}
            style={{
              width: "100%",
              marginTop: 18,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              padding: "12px 16px",
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Passer la commande
          </button>

          <Link
            to="/products"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 12,
              textDecoration: "none",
              color: "#2563eb",
              fontWeight: 600,
            }}
          >
            Continuer mes achats
          </Link>
        </aside>
      </div>
    </section>
  );
}

function Row({ label, value, bold = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ color: "#6b7280" }}>{label}</span>
      <span style={{ fontWeight: bold ? 800 : 600 }}>{value}</span>
    </div>
  );
}

const qtyBtnStyle = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};
