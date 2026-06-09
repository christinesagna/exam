import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProduct,
  getProductReviews,
  getSellerProfile,
  isProductFavorite,
} from "../services/productService";
import { addFavorite, removeFavorite } from "../services/favoriteService";
 
export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [product, setProduct]     = useState(null);
  const [reviews, setReviews]     = useState([]);
  const [seller, setSeller]       = useState(null);
  const [isFav, setIsFav]         = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeImage, setActiveImage] = useState(0);
 
  useEffect(() => {
    setLoading(true);
    setError(null);
 
    // Chargement produit + avis en parallèle
    Promise.all([
      getProduct(id),
      getProductReviews(id),
    ])
      .then(async ([prodRes, reviewsRes]) => {
        const prod = prodRes.data.data ?? prodRes.data;
        setProduct(prod);
        setReviews(reviewsRes.data.data ?? []);
 
        // Profil vendeur
        if (prod.seller?.id) {
          getSellerProfile(prod.seller.id)
            .then((r) => setSeller(r.data.data ?? r.data))
            .catch(() => {});
        }
 
        // Statut favori (ignoré si non connecté)
        isProductFavorite(id)
          .then((r) => setIsFav(r.data.is_favorite))
          .catch(() => {});
      })
      .catch(() => setError("Impossible de charger ce produit."))
      .finally(() => setLoading(false));
  }, [id]);
 
  const handleToggleFav = async () => {
    try {
      if (isFav) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
      setIsFav(!isFav);
    } catch {
      alert("Connecte-toi pour gérer tes favoris.");
    }
  };
 
  if (loading) return <LoadingScreen />;
  if (error)   return <ErrorScreen message={error} onBack={() => navigate(-1)} />;
  if (!product) return null;
 
  const price     = product.effective_price ?? product.price;
  const images    = product.images ?? [];
  const imageUrl  = images[activeImage]?.url ?? "/placeholder.png";
 
  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Retour */}
      <button
        onClick={() => navigate(-1)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 14, marginBottom: 20 }}
      >
        ← Retour au catalogue
      </button>
 
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        {/* Galerie images */}
        <div style={{ flex: "0 0 420px" }}>
          <div style={{ borderRadius: 12, overflow: "hidden", background: "#f3f4f6", aspectRatio: "4/3" }}>
            <img src={imageUrl} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: 60, height: 60, objectFit: "cover", borderRadius: 8, cursor: "pointer",
                    border: i === activeImage ? "2px solid #2563eb" : "2px solid transparent",
                  }}
                />
              ))}
            </div>
          )}
        </div>
 
        {/* Infos produit */}
        <div style={{ flex: 1, minWidth: 280 }}>
          {product.is_on_sale && (
            <span style={{ background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20 }}>
              PROMO
            </span>
          )}
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "10px 0 8px" }}>{product.title}</h1>
 
          {/* Prix */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{Number(price).toFixed(2)} €</span>
            {product.is_on_sale && product.price !== price && (
              <span style={{ fontSize: 16, color: "#9ca3af", textDecoration: "line-through" }}>
                {Number(product.price).toFixed(2)} €
              </span>
            )}
          </div>
 
          {/* Description */}
          {product.description && (
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 20 }}>
              {product.description}
            </p>
          )}
 
          {/* Actions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              style={{
                padding: "12px 28px", background: "#2563eb", color: "#fff",
                border: "none", borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: "pointer",
              }}
            >
              Ajouter au panier
            </button>
            <button
              onClick={handleToggleFav}
              style={{
                padding: "12px 20px", background: "#f3f4f6",
                border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 20, cursor: "pointer",
              }}
              aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>
 
          {/* Stats */}
          <div style={{ marginTop: 20, display: "flex", gap: 20, fontSize: 13, color: "#6b7280" }}>
            {product.sales_count > 0 && <span>🛒 {product.sales_count} ventes</span>}
            {product.views       > 0 && <span>👁️ {product.views} vues</span>}
          </div>
        </div>
      </div>
 
      {/* Profil vendeur */}
      {seller && (
        <div style={{ marginTop: 40, padding: 20, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>À propos du vendeur</h2>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", background: "#e5e7eb",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>
              {seller.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{seller.name}</p>
              {seller.location && <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>{seller.location}</p>}
            </div>
            <button
              onClick={() => navigate(`/sellers/${seller.id}`)}
              style={{
                marginLeft: "auto", padding: "8px 16px", background: "#f3f4f6",
                border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer", fontSize: 13,
              }}
            >
              Voir la boutique →
            </button>
          </div>
        </div>
      )}
 
      {/* Avis */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Avis clients ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: 14 }}>Aucun avis pour ce produit.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 
// ── Composants internes ───────────────────────────────────────
 
function ReviewCard({ review }) {
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  return (
    <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{review.user?.name ?? "Anonyme"}</span>
        <span style={{ color: "#f59e0b", fontSize: 16 }}>{stars}</span>
      </div>
      {review.comment && <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>{review.comment}</p>}
      <p style={{ margin: "6px 0 0", fontSize: 11, color: "#9ca3af" }}>
        {new Date(review.created_at).toLocaleDateString("fr-FR")}
      </p>
    </div>
  );
}
 
function LoadingScreen() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
      <p style={{ color: "#6b7280" }}>Chargement…</p>
    </div>
  );
}
 
function ErrorScreen({ message, onBack }) {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <p style={{ color: "#b91c1c", marginBottom: 16 }}>{message}</p>
      <button onClick={onBack} style={{ padding: "8px 20px", cursor: "pointer" }}>← Retour</button>
    </div>
  );
}