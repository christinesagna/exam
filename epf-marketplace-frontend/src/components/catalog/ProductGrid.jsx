import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";

export default function ProductGrid({
  products = [],
  loading = false,
  error = "",
  compact = false,
}) {
  if (loading) {
    return <Loader text="Chargement des produits..." />;
  }

  if (error) {
    return (
      <div
        style={{
          padding: 22,
          borderRadius: 18,
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#991b1b",
        }}
      >
        {error}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div
        style={{
          padding: 26,
          borderRadius: 18,
          background: "#f8fafc",
          border: "1px dashed #cbd5e1",
          color: "#64748b",
          textAlign: "center",
        }}
      >
        Aucun produit trouvé.
      </div>
    );
  }

  return (
    <div
      className="product-grid"
      style={{
        display: "grid",
        gap: compact ? 14 : 18,
        gridTemplateColumns: compact
          ? "repeat(auto-fill,minmax(210px,1fr))"
          : "repeat(auto-fill,minmax(240px,1fr))",
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} compact={compact} />
      ))}
    </div>
  );
}

function ProductCard({ product, compact }) {
  const [imageError, setImageError] = useState(false);

  const name = product.title || product.name || "Produit";
  const description = product.description || "Aucune description disponible.";
  const image =
    product.thumbnail ||
    product.image_url ||
    product.image ||
    (Array.isArray(product.images) ? product.images[0]?.url || product.images[0] : null);

  const rawPrice = product.effective_price ?? product.price;
  const price = rawPrice !== undefined && rawPrice !== null ? `${Number(rawPrice).toFixed(2)} FCFA` : "Prix non défini";

  return (
    <Link
      to={`/products/${product.id}`}
      className="product-card"
      style={{
        display: "block",
        padding: compact ? 14 : 16,
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        textDecoration: "none",
        color: "inherit",
        background: "#fff",
        boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          minHeight: compact ? 150 : 180,
          marginBottom: 14,
          background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {image && !imageError ? (
          <img
            src={image}
            alt={name}
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              height: compact ? 150 : 180,
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: compact ? 150 : 180,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 28 }}>🛍️</span>
            <span style={{ fontWeight: 600 }}>Image indisponible</span>
          </div>
        )}

        {product.category?.name && (
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              padding: "6px 10px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.92)",
              color: "#0f172a",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {product.category.name}
          </span>
        )}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: compact ? 17 : 18, lineHeight: 1.3 }}>{name}</h3>
          <p
            style={{
              margin: "8px 0 0",
              color: "#64748b",
              minHeight: 42,
              lineHeight: 1.5,
              fontSize: 14,
            }}
          >
            {description}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <strong style={{ fontSize: 18, color: "#0f172a" }}>{price}</strong>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 14px",
              borderRadius: 999,
              background: "#eff6ff",
              color: "#1d4ed8",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Voir le produit
          </span>
        </div>
      </div>
    </Link>
  );
}
