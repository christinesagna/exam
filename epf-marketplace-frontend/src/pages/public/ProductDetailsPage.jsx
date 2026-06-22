import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faImage, faShoppingCart, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import ReviewList from "../../components/catalog/ReviewList";
import ReviewForm from "../../components/ReviewForm";           // ✅ ajouté
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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageCandidateIndex, setImageCandidateIndex] = useState(0);
  const [mainImageError, setMainImageError] = useState(false);

  const isBuyer = user?.role === "buyer";

  // Cherche si l'utilisateur connecté a déjà posté un avis
  const myExistingReview = reviews.find(
    (r) => r.user_id === user?.id || r.reviewer_id === user?.id
  ) ?? null;

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        setSelectedIndex(0);
        setImageCandidateIndex(0);
        setMainImageError(false);

        const data = await productService.getById(id);
        if (!ignore) setProduct(data);

        try {
          const reviewData = await productService.getProductReviews(id);
          const arr = reviewData?.items ?? (Array.isArray(reviewData) ? reviewData : []);
          if (!ignore) setReviews(arr.length > 0 ? arr : (data?.reviews ?? []));
        } catch {
          if (!ignore) setReviews(data?.reviews ?? []);
        }

        if (isAuthenticated && isBuyer) {
          try {
            const fav = await favoriteService.isFavorite(id);
            const val = fav?.is_favorite ?? fav?.data?.is_favorite ?? false;
            if (!ignore) setIsFavorite(Boolean(val));
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

    load();
    return () => { ignore = true; };
  }, [id, isAuthenticated, isBuyer]);

  const images = product?.images?.length
    ? product.images
    : product?.thumbnail
    ? [product.thumbnail]
    : [];

  // Pour chaque image, liste des URL alternatives à essayer si la principale
  // renvoie une erreur (storage:link manquant côté backend, chemin mal
  // préfixé, etc.). Aligné sur "images" ci-dessus.
  const imagesCandidates = product?.images?.length
    ? product.imageCandidates ?? []
    : product?.thumbnailCandidates?.length
    ? [product.thumbnailCandidates]
    : [];

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
      toast.success("Produit ajouté au panier !");
    } catch { toast.error("Impossible d'ajouter ce produit au panier."); }
    finally { setCartLoading(false); }
  };

  // ✅ Rafraîchit la liste des avis après soumission ou suppression
  const handleReviewSubmitted = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleReviewDeleted = (deletedId) => {
    setReviews((prev) => prev.filter((r) => r.id !== deletedId));
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Produit introuvable." />;

  const description = product.description || product.details || product.summary || "";

  // URL alternatives pour l'image actuellement sélectionnée
  const currentCandidates = imagesCandidates[selectedIndex]?.length
    ? imagesCandidates[selectedIndex]
    : images[selectedIndex]
    ? [images[selectedIndex]]
    : [];

  const currentImage = !mainImageError
    ? currentCandidates[imageCandidateIndex] ?? images[selectedIndex] ?? null
    : null;

  const handleMainImageError = () => {
    if (imageCandidateIndex < currentCandidates.length - 1) {
      setImageCandidateIndex((i) => i + 1);
    } else {
      setMainImageError(true);
    }
  };

  return (
    <section>
      <Link to="/products" style={{ color: "#2563eb", textDecoration: "none" }}>
        <FontAwesomeIcon icon={faArrowLeft} /> Retour au catalogue
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 20, alignItems: "start" }}>

        {/* Colonne image */}
        <div>
          <div style={{
            border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden",
            background: "#f9fafb", height: 380,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.title || product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={handleMainImageError}
              />
            ) : (
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                <div style={{ fontSize: 56 }}><FontAwesomeIcon icon={faImage} /></div>
                <div style={{ fontSize: 13, marginTop: 8 }}>Pas d'image disponible</div>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Vue ${idx + 1}`}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setImageCandidateIndex(0);
                    setMainImageError(false);
                  }}
                  style={{
                    width: 60, height: 60, objectFit: "cover", borderRadius: 8, cursor: "pointer",
                    border: selectedIndex === idx ? "2px solid #2563eb" : "2px solid #e5e7eb",
                  }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Colonne infos */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24 }}>
          <h1 style={{ marginTop: 0, marginBottom: 12 }}>{product.title || product.name}</h1>

          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: "#2563eb" }}>
              {Number(product.effective_price ?? product.price ?? 0).toLocaleString("fr-FR")} FCFA
            </span>
            {product.effective_price && product.price && Number(product.effective_price) < Number(product.price) && (
              <span style={{ marginLeft: 10, textDecoration: "line-through", color: "#9ca3af", fontSize: 16 }}>
                {Number(product.price).toLocaleString("fr-FR")} FCFA
              </span>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Description
            </h3>
            {description ? (
              <p style={{ color: "#374151", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
                {description}
              </p>
            ) : (
              <p style={{ color: "#9ca3af", fontStyle: "italic", margin: 0 }}>
                Aucune description fournie par le vendeur.
              </p>
            )}
          </div>

          {product.category?.name && (
            <p style={{ margin: "8px 0" }}>
              <strong>Catégorie :</strong>{" "}
              <span style={{ background: "#eff6ff", color: "#2563eb", padding: "2px 10px", borderRadius: 20, fontSize: 13 }}>
                {product.category.name}
              </span>
            </p>
          )}

          {product.seller?.id && (
            <p style={{ margin: "8px 0" }}>
              <strong>Vendeur :</strong>{" "}
              <Link to={`/sellers/${product.seller.id}`} style={{ color: "#2563eb" }}>
                {product.seller.name || "Voir le vendeur"}
              </Link>
            </p>
          )}

          <p style={{ margin: "8px 0 20px" }}>
            <strong>Stock :</strong>{" "}
            <span style={{ color: (product.stock ?? 0) > 0 ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
              {(product.stock ?? 0) > 0 ? `${product.stock} disponible(s)` : "Rupture de stock"}
            </span>
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || (product.stock ?? 0) === 0}
              style={{
                border: "none",
                background: (product.stock ?? 0) === 0 ? "#9ca3af" : "#2563eb",
                color: "#fff", padding: "13px 20px", borderRadius: 12,
                cursor: (product.stock ?? 0) === 0 ? "not-allowed" : "pointer",
                fontWeight: 700, fontSize: 15,
              }}
            >
              {cartLoading ? "Ajout en cours..." : <><FontAwesomeIcon icon={faShoppingCart} /> Ajouter au panier</>}
            </button>

            {isBuyer && (
              <button
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                style={{
                  border: "1px solid #d1d5db", background: "#fff", color: "#111827",
                  padding: "13px 20px", borderRadius: 12, cursor: "pointer", fontWeight: 600, fontSize: 15,
                }}
              >
                {isFavorite ? <><FontAwesomeIcon icon={faHeart} style={{ color: "#ef4444" }} /> Retirer des favoris</> : <><FontAwesomeIcon icon={faHeart} /> Ajouter aux favoris</>}
              </button>
            )}

            {isBuyer && product.seller?.id && (
              <Link
                to={`/messages/${product.seller.id}`}
                style={{
                  display: "block", textAlign: "center", textDecoration: "none",
                  border: "1px solid #d1d5db", color: "#374151",
                  padding: "13px 20px", borderRadius: 12, fontWeight: 600, fontSize: 15,
                  background: "#f9fafb",
                }}
              >
                <FontAwesomeIcon icon={faComment} /> Contacter le vendeur
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ===================== Section avis ===================== */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ marginBottom: 16 }}>
          Avis clients{" "}
          {reviews.length > 0 && (
            <span style={{ color: "#6b7280", fontWeight: 400, fontSize: 16 }}>
              ({reviews.length})
            </span>
          )}
        </h2>

        {/* ✅ Formulaire affiché uniquement pour les buyers connectés */}
        {isAuthenticated && isBuyer ? (
          <ReviewForm
            productId={product.id}
            existingReview={myExistingReview}
            onReviewSubmitted={handleReviewSubmitted}
            onReviewDeleted={handleReviewDeleted}
          />
        ) : !isAuthenticated ? (
          <p style={{ color: "#6b7280", marginBottom: 16, fontSize: 14 }}>
            <Link to="/login" style={{ color: "#2563eb" }}>Connecte-toi</Link> pour laisser un avis.
          </p>
        ) : null}

        <ReviewList reviews={reviews} />
      </div>
    </section>
  );
}