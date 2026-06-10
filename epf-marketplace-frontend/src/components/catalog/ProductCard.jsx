import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const isBuyer = user?.role === "buyer";

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

  useEffect(() => {
    let ignore = false;

    const checkFavorite = async () => {
      if (!isAuthenticated || !isBuyer || !product?.id) return;

      try {
        const result = await favoriteService.isFavorite(product.id);
        const value =
          result?.is_favorite ??
          result?.data?.is_favorite ??
          false;

        if (!ignore) {
          setIsFavorite(Boolean(value));
        }
      } catch {
        if (!ignore) setIsFavorite(false);
      }
    };

    checkFavorite();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, isBuyer, product?.id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Connecte-toi pour gérer les favoris.");
      navigate("/login");
      return;
    }

    if (!isBuyer) {
      toast.error("Cette action est réservée au buyer.");
      return;
    }

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
    } catch {
      toast.error("Impossible de mettre à jour les favoris.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Connecte-toi pour ajouter au panier.");
      navigate("/login");
      return;
    }

    if (!isBuyer) {
      toast.error("Le panier est réservé au buyer.");
      return;
    }

    try {
      setCartLoading(true);
      await addToCart(product.id, 1);
    } catch {
      toast.error("Impossible d'ajouter ce produit au panier.");
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <article
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 4px 18px rgba(15,23,42,0.04)",
      }}
    >
      <div style={{ position: "relative" }}>
        <Link
          to={`/products/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              height: 220,
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
              <span style={{ color: "#6b7280" }}>Pas d’image</span>
            )}
          </div>
        </Link>

        {isBuyer && (
          <button
            onClick={handleToggleFavorite}
            disabled={favoriteLoading}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              border: "1px solid #e5e7eb",
              background: "#fff",
              borderRadius: "999px",
              width: 40,
              height: 40,
              cursor: "pointer",
              fontSize: 18,
            }}
            aria-label="Basculer le favori"
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        )}
      </div>

      <div style={{ padding: 16 }}>
        <Link
          to={`/products/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h3 style={{ margin: "0 0 8px", fontSize: 17 }}>
            {product.title || product.name}
          </h3>
        </Link>

        {product.category?.name && (
          <p style={{ margin: "0 0 8px", color: "#6b7280", fontSize: 14 }}>
            {product.category.name}
          </p>
        )}

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
          <strong style={{ fontSize: 20, color: "#111827" }}>
            {Number(price).toFixed(2)} FCFA
          </strong>

          {oldPrice && (
            <span
              style={{
                color: "#9ca3af",
                textDecoration: "line-through",
                fontSize: 14,
              }}
            >
              {Number(oldPrice).toFixed(2)} FCFA
            </span>
          )}
        </div>

        {product.seller?.name && (
          <p style={{ margin: "0 0 14px", fontSize: 14, color: "#4b5563" }}>
            Vendeur : <strong>{product.seller.name}</strong>
          </p>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <Link
            to={`/products/${product.id}`}
            style={{
              flex: 1,
              textAlign: "center",
              textDecoration: "none",
              border: "1px solid #d1d5db",
              color: "#111827",
              padding: "10px 12px",
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Voir
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            style={{
              flex: 1,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              padding: "10px 12px",
              borderRadius: 10,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {cartLoading ? "Ajout..." : "Panier"}
          </button>
        </div>
      </div>
    </article>
  );
}
