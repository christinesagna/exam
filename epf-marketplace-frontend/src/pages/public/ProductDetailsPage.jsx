import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import ReviewList from "../../components/catalog/ReviewList";
import { productService } from "../../services/productService";
import { favoriteService } from "../../services/favoriteService";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const isBuyer = user?.role === "buyer";

  useEffect(() => {
    let ignore = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await productService.getById(id);

        if (!ignore) {
          setProduct(data);
        }

        if (isAuthenticated && isBuyer) {
          try {
            const fav = await favoriteService.isFavorite(id);
            const value = fav?.is_favorite ?? fav?.data?.is_favorite ?? false;
            if (!ignore) {
              setIsFavorite(Boolean(value));
            }
          } catch {
            if (!ignore) setIsFavorite(false);
          }
        }
      } catch {
        if (!ignore) setError("Impossible de charger ce produit.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [id, isAuthenticated, isBuyer]);

  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length) return product.images;
    const fallback = product.thumbnail || product.image;
    return fallback ? [fallback] : [];
  }, [product]);

  const firstImage =
    typeof images[0] === "string" ? images[0] : images?.[0]?.url || null;

  const reviews = product?.reviews || product?.product_reviews || [];

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
        toast.success("Produit retiré des favoris.");
      } else {
        await favoriteService.addFavorite(product.id);
        setIsFavorite(true);
        toast.success("Produit ajouté aux favoris.");
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

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Produit introuvable." />;

  return (
    <section>
      <Link to="/products" style={{ color: "#2563eb", textDecoration: "none" }}>
        ← Retour au catalogue
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginTop: 20,
          alignItems: "start",
        }}
      >
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            overflow: "hidden",
            background: "#fff",
            minHeight: 380,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.title || product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span>Pas d’image</span>
          )}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24 }}>
          <h1 style={{ marginTop: 0 }}>{product.title || product.name}</h1>

          <p style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
            {Number(product.effective_price ?? product.price ?? 0).toFixed(2)} FCFA
          </p>

          <p style={{ color: "#4b5563", lineHeight: 1.7 }}>
            {product.description || "Aucune description disponible."}
          </p>

          {product.category?.name && (
            <p><strong>Catégorie :</strong> {product.category.name}</p>
          )}

          {product.seller?.id && (
            <p>
              <strong>Vendeur :</strong>{" "}
              <Link to={`/sellers/${product.seller.id}`}>
                {product.seller.name || "Voir le vendeur"}
              </Link>
            </p>
          )}

          <p><strong>Stock :</strong> {product.stock ?? "N/A"}</p>

          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              style={{
                border: "none",
                background: "#2563eb",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {cartLoading ? "Ajout..." : "Ajouter au panier"}
            </button>

            {isBuyer && (
              <button
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                style={{
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  color: "#111827",
                  padding: "12px 18px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {isFavorite ? "❤️ Retirer des favoris" : "🤍 Ajouter aux favoris"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2>Avis</h2>
        <ReviewList reviews={reviews} />
      </div>
    </section>
  );
}
