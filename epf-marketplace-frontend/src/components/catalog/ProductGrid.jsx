import { Link } from "react-router-dom";
import Loader from "../common/Loader";

export default function ProductGrid({ products = [], loading = false, error = "" }) {
  if (loading) {
    return <Loader text="Chargement des produits..." />;
  }

  if (error) {
    return (
      <div className="app-card">
        <p>{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="app-card">
        <p>Aucun produit trouvé.</p>
      </div>
    );
  }

  return (
    <div className="product-grid" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/products/${product.id}`}
          className="product-card"
          style={{
            display: "block",
            padding: 16,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            textDecoration: "none",
            color: "inherit",
            background: "#fff",
          }}
        >
          <div style={{ minHeight: 140, marginBottom: 12, background: "#f9fafb", borderRadius: 10 }}>
            {(product.image_url || product.image) ? (
              <img
                src={product.image_url || product.image}
                alt={product.title || product.name}
                style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10 }}
              />
            ) : (
              <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                Image indisponible
              </div>
            )}
          </div>
          <h3 style={{ margin: 0, fontSize: 18 }}>{product.title || product.name}</h3>
          <p style={{ margin: "8px 0", color: "#6b7280", minHeight: 40 }}>{product.description || "Aucune description disponible."}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <strong>{product.price ? `${product.price} FCFA` : "Prix non défini"}</strong>
            <span style={{ color: "#2563eb" }}>Voir</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
