import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faHeart, faComment, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { favoriteService } from "../../services/favoriteService";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isBuyer = user?.role === "buyer";

  // thumbnail et image sont des strings URL absolues (après normalizeProduct)
  // images est un tableau de strings
  const image = !imgError
    ? (product?.thumbnail ||
       product?.image ||
       product?.image_url ||
       (typeof product?.images?.[0] === "string" ? product.images[0] : product?.images?.[0]?.url) ||
       null)
    : null;

  const price = product?.effective_price ?? product?.price ?? 0;
  const oldPrice =
    product?.effective_price &&
    product?.price &&
    Number(product.effective_price) < Number(product.price)
      ? product.price
      : null;

  useEffect(() => {
    let ignore = false;
    const checkFavorite = async () => {
      if (!isAuthenticated || !isBuyer || !product?.id) return;
      try {
        const result = await favoriteService.isFavorite(product.id);
        const value = result?.is_favorite ?? result?.data?.is_favorite ?? false;
        if (!ignore) setIsFavorite(Boolean(value));
      } catch {
        if (!ignore) setIsFavorite(false);
      }
    };
    checkFavorite();
    return () => { ignore = true; };
  }, [isAuthenticated, isBuyer, product?.id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) { toast.error("Connecte-toi pour gérer les favoris."); navigate("/login"); return; }
    if (!isBuyer) { toast.error("Cette action est réservée au buyer."); return; }
    try {
      setFavoriteLoading(true);
      if (isFavorite) {
        await favoriteService.removeFavorite(product.id);
        setIsFavorite(false);
        toast.success("Retiré des favoris.");
      } else {
        await favoriteService.addFavorite(product.id);
        setIsFavorite(true);
        toast.success("Ajouté aux favoris.");
      }
    } catch { toast.error("Impossible de mettre à jour les favoris."); }
    finally { setFavoriteLoading(false); }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error("Connecte-toi pour ajouter au panier."); navigate("/login"); return; }
    if (!isBuyer) { toast.error("Le panier est réservé au buyer."); return; }
    try {
      setCartLoading(true);
      await addToCart(product.id, 1);
      toast.success("Ajouté au panier !");
    } catch { toast.error("Impossible d'ajouter ce produit au panier."); }
    finally { setCartLoading(false); }
  };

  return (
    <article
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 4px 18px rgba(15,23,42,0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative" }}>
        <Link to={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div
            style={{
              height: 220,
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {image ? (
              <img
                src={image}
                alt={product.title || product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                <div style={{ fontSize: 40, marginBottom: 6 }}><FontAwesomeIcon icon={faImage} /></div>
                <div style={{ fontSize: 12 }}>Pas d'image</div>
              </div>
            )}
          </div>
        </Link>

        {isBuyer && (
          <button
            onClick={handleToggleFavorite}
            disabled={favoriteLoading}
            style={{
              position: "absolute", top: 10, right: 10,
              border: "1px solid #e5e7eb", background: "rgba(255,255,255,0.9)",
              borderRadius: "999px", width: 36, height: 36,
              cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: isFavorite ? "#ef4444" : "#d1d5db",
            }}
            aria-label="Basculer le favori"
          >
            <FontAwesomeIcon icon={faHeart} style={{ opacity: isFavorite ? 1 : 0.5 }} />
          </button>
        )}
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
        <Link to={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, lineHeight: 1.3 }}>
            {product.title || product.name}
          </h3>
        </Link>

        {product.category?.name && (
          <p style={{ margin: "0 0 8px", color: "#6b7280", fontSize: 13 }}>
            {product.category.name}
          </p>
        )}

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
          <strong style={{ fontSize: 18, color: "#111827" }}>
            {Number(price).toLocaleString("fr-FR")} FCFA
          </strong>
          {oldPrice && (
            <span style={{ color: "#9ca3af", textDecoration: "line-through", fontSize: 13 }}>
              {Number(oldPrice).toLocaleString("fr-FR")} FCFA
            </span>
          )}
        </div>

        {product.seller?.name && (
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#4b5563" }}>
            Vendeur : <strong>{product.seller.name}</strong>
          </p>
        )}

        {/* Bouton "Écrire un message" au vendeur — visible pour les buyers */}
        {isBuyer && product.seller?.id && (
          <Link
            to={`/messages/${product.seller.id}`}
            style={{
              display: "block",
              textAlign: "center",
              textDecoration: "none",
              border: "1px solid #d1d5db",
              color: "#374151",
              padding: "8px 10px",
              borderRadius: 10,
              fontWeight: 500,
              fontSize: 13,
              marginBottom: 8,
              background: "#f9fafb",
            }}
          >
            <FontAwesomeIcon icon={faComment} /> Écrire au vendeur
          </Link>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <Link
            to={`/products/${product.id}`}
            style={{
              flex: 1, textAlign: "center", textDecoration: "none",
              border: "1px solid #d1d5db", color: "#111827",
              padding: "10px 10px", borderRadius: 10, fontWeight: 600, fontSize: 14,
            }}
          >
            Voir
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            style={{
              flex: 1, border: "none", background: "#2563eb", color: "#fff",
              padding: "10px 10px", borderRadius: 10, fontWeight: 600,
              cursor: "pointer", fontSize: 14,
            }}
          >
            {cartLoading ? "Ajout..." : <><FontAwesomeIcon icon={faShoppingCart} /> Panier</>}
          </button>
        </div>
      </div>
    </article>
  );
}
