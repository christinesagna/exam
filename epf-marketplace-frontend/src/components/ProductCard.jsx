import { useState } from "react";
 
/**
 * ProductCard – carte produit réutilisable
 * Props :
 *   product  : objet produit (id, title, effective_price, is_on_sale, sale_price,
 *               images[], seller, sales_count, category)
 *   isFavorite: bool (optionnel)
 *   onToggleFavorite: fn(product_id) (optionnel)
 *   onClick  : fn(product) – navigation vers la fiche
 */
export default function ProductCard({ product, isFavorite = false, onToggleFavorite, onClick }) {
  const [favLoading, setFavLoading] = useState(false);
 
  const handleFav = async (e) => {
    e.stopPropagation();
    if (!onToggleFavorite) return;
    setFavLoading(true);
    await onToggleFavorite(product.id);
    setFavLoading(false);
  };
 
  const imageUrl = product.images?.[0]?.url ?? "/placeholder.png";
  const price = product.effective_price ?? product.price;
 
  return (
    <div
      className="product-card"
      onClick={() => onClick?.(product)}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        background: "#fff",
        transition: "box-shadow .2s",
        position: "relative",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Image */}
      <div style={{ position: "relative", paddingTop: "66%" }}>
        <img
          src={imageUrl}
          alt={product.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Badge promo */}
        {product.is_on_sale && (
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: "#ef4444",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 20,
            }}
          >
            PROMO
          </span>
        )}
        {/* Bouton favori */}
        <button
          onClick={handleFav}
          disabled={favLoading}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "rgba(255,255,255,.85)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
 
      {/* Infos */}
      <div style={{ padding: "12px 14px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: "#111",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.title}
        </p>
 
        {product.seller?.name && (
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>
            Vendu par {product.seller.name}
          </p>
        )}
 
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>
            {Number(price).toFixed(2)} €
          </span>
          {product.is_on_sale && product.price !== price && (
            <span style={{ fontSize: 13, color: "#9ca3af", textDecoration: "line-through" }}>
              {Number(product.price).toFixed(2)} €
            </span>
          )}
        </div>
 
        {product.sales_count > 0 && (
          <p style={{ margin: "6px 0 0", fontSize: 11, color: "#9ca3af" }}>
            {product.sales_count} vente{product.sales_count > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}