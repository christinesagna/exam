import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const image =
    product?.thumbnail ||
    product?.image ||
    product?.images?.[0]?.url ||
    product?.images?.[0] ||
    null;

  const price = product?.effective_price ?? product?.price ?? 0;
  const oldPrice =
    product?.effective_price && product?.price !== product?.effective_price
      ? product.price
      : null;

  return (
    <article
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <Link
        to={`/products/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div
          style={{
            height: "220px",
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
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <span style={{ color: "#6b7280" }}>Pas d’image</span>
          )}
        </div>

        <div style={{ padding: "14px" }}>
          <h3
            style={{
              marginTop: 0,
              marginBottom: "8px",
              fontSize: "1rem",
            }}
          >
            {product.title || product.name}
          </h3>

          {product.category?.name && (
            <p style={{ margin: "0 0 8px", color: "#6b7280", fontSize: "14px" }}>
              {product.category.name}
            </p>
          )}

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <strong style={{ fontSize: "18px", color: "#111827" }}>
              {Number(price).toFixed(2)} FCFA
            </strong>

            {oldPrice && (
              <span
                style={{
                  color: "#9ca3af",
                  textDecoration: "line-through",
                  fontSize: "14px",
                }}
              >
                {Number(oldPrice).toFixed(2)} FCFA
              </span>
            )}
          </div>

          {product.seller?.id && (
            <p style={{ marginTop: "10px", marginBottom: 0, fontSize: "14px" }}>
              Vendeur :{" "}
              <span style={{ color: "#2563eb" }}>
                {product.seller.name || "Voir le vendeur"}
              </span>
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
