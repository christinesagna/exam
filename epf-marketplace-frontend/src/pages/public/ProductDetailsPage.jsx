import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import ReviewList from "../../components/catalog/ReviewList";
import Pagination from "../../components/catalog/Pagination";
import { productService } from "../../services/productService";

export default function ProductDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviewsData, setReviewsData] = useState({
    items: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [reviewPage, setReviewPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const loadedProduct = await productService.getById(id);
        setProduct(loadedProduct);

        if (loadedProduct?.seller?.id) {
          const loadedSeller = await productService.getSellerPublic(loadedProduct.seller.id);
          setSeller(loadedSeller);
        } else {
          setSeller(null);
        }
      } catch {
        setError("Impossible de charger ce produit.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await productService.getReviews(id, { page: reviewPage, per_page: 5 });
        setReviewsData(data);
      } catch {
        setReviewsData({ items: [], currentPage: 1, lastPage: 1, total: 0 });
      }
    };

    loadReviews();
  }, [id, reviewPage]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Produit introuvable." />;

  const images = Array.isArray(product.images) ? product.images : [];
  const firstImage = product.thumbnail || product.image || images?.[0]?.url || images?.[0] || null;
  const price = Number(product.effective_price ?? product.price ?? 0).toFixed(2);

  return (
    <section style={{ display: "grid", gap: 24 }}>
      <Link to="/products" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>
        ← Retour au catalogue
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 480px) 1fr",
          gap: 24,
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          padding: 24,
        }}
      >
        <div
          style={{
            minHeight: 340,
            background: "#f8fafc",
            borderRadius: 16,
            overflow: "hidden",
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

        <div>
          <h1 style={{ marginTop: 0 }}>{product.title || product.name}</h1>
          <p style={{ fontSize: 28, fontWeight: 800, margin: "6px 0 18px" }}>{price} FCFA</p>
          <p style={{ color: "#475569", lineHeight: 1.7 }}>
            {product.description || "Aucune description disponible."}
          </p>

          {product.category?.name && (
            <p><strong>Catégorie :</strong> {product.category.name}</p>
          )}
          <p><strong>Stock :</strong> {product.stock ?? "N/A"}</p>

          {seller && (
            <div style={{ marginTop: 24, padding: 16, background: "#f8fafc", borderRadius: 14 }}>
              <h2 style={{ marginTop: 0, fontSize: 18 }}>Vendeur</h2>
              <p style={{ marginBottom: 8 }}>
                <strong>{seller.shop_name || seller.name || "Vendeur"}</strong>
              </p>
              <p style={{ marginTop: 0, color: "#64748b" }}>
                {seller.bio || seller.description || "Profil public du vendeur."}
              </p>
              <Link to={`/sellers/${seller.id || product.seller?.id}`} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>
                Voir le profil vendeur
              </Link>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Avis produit</h2>
          <span style={{ color: "#64748b" }}>{reviewsData.total} avis</span>
        </div>

        <ReviewList reviews={reviewsData.items} />

        <Pagination
          currentPage={reviewsData.currentPage}
          lastPage={reviewsData.lastPage}
          onPageChange={setReviewPage}
        />
      </div>
    </section>
  );
}
