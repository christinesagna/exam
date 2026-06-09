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
  const [reviewsData, setReviewsData] = useState({
    items: [],
    currentPage: 1,
    lastPage: 1,
  });
  const [reviewsPage, setReviewsPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setReviewsPage(1);
  }, [id]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const [productData, productReviews] = await Promise.all([
          productService.getById(id),
          productService.getProductReviews(id, { page: reviewsPage }),
        ]);

        setProduct(productData);
        setReviewsData(productReviews);
      } catch {
        setError("Impossible de charger ce produit.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, reviewsPage]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Produit introuvable." />;

  const images = Array.isArray(product.images) ? product.images : [];
  const firstImage =
    product.thumbnail || product.image || images?.[0]?.url || images?.[0] || null;

  return (
    <section>
      <Link to="/products" style={{ color: "#2563eb" }}>
        ← Retour au catalogue
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            overflow: "hidden",
            background: "#fff",
            minHeight: "380px",
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
          <h1>{product.title || product.name}</h1>

          <p style={{ fontSize: "20px", fontWeight: 700 }}>
            {Number(product.effective_price ?? product.price ?? 0).toFixed(2)} FCFA
          </p>

          <p style={{ color: "#4b5563" }}>
            {product.description || "Aucune description disponible."}
          </p>

          {product.category?.name && (
            <p>
              <strong>Catégorie :</strong> {product.category.name}
            </p>
          )}

          {product.seller?.id && (
            <p>
              <strong>Vendeur :</strong>{" "}
              <Link to={`/sellers/${product.seller.id}`}>
                {product.seller.name || "Voir le vendeur"}
              </Link>
            </p>
          )}

          <p>
            <strong>Stock :</strong> {product.stock ?? "N/A"}
          </p>
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <h2>Avis produit</h2>

        <ReviewList reviews={reviewsData.items} />

        <Pagination
          currentPage={reviewsData.currentPage}
          lastPage={reviewsData.lastPage}
          onPageChange={setReviewsPage}
        />
      </div>
    </section>
  );
}
