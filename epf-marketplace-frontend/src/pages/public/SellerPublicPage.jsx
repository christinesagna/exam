import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import ProductGrid from "../../components/catalog/ProductGrid";
import ReviewList from "../../components/catalog/ReviewList";
import Pagination from "../../components/catalog/Pagination";
import { productService } from "../../services/productService";
import { useAuth } from "../../hooks/useAuth";

export default function SellerPublicPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const isBuyer = user?.role === "buyer";

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productsData, setProductsData] = useState({ items: [], currentPage: 1, lastPage: 1 });
  const [sellerReviewsData, setSellerReviewsData] = useState({ items: [], currentPage: 1, lastPage: 1 });
  const [productsPage, setProductsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);

  useEffect(() => {
    let ignore = false;
    const loadSellerPage = async () => {
      try {
        setLoading(true);
        setError("");
        const [sellerData, products, reviews] = await Promise.all([
          productService.getSellerPublic(id),
          productService.getSellerProducts(id, { page: productsPage }),
          productService.getSellerReviews(id, { page: reviewsPage }),
        ]);
        if (!ignore) {
          setSeller(sellerData);
          setProductsData(products);
          setSellerReviewsData(reviews);
        }
      } catch {
        if (!ignore) setError("Impossible de charger ce profil vendeur.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadSellerPage();
    return () => { ignore = true; };
  }, [id, productsPage, reviewsPage]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
      {/* Profil vendeur */}
      <div style={{
        padding: 24, border: "1px solid #e5e7eb", borderRadius: 16,
        background: "#fff", marginBottom: 24,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <h1 style={{ marginTop: 0, marginBottom: 8 }}>
            🏪 {seller?.shop_name || seller?.name || "Vendeur"}
          </h1>
          <p style={{ color: "#4b5563", margin: "0 0 12px", maxWidth: 600 }}>
            {seller?.bio || seller?.description || "Aucune description disponible."}
          </p>
          {seller?.city && (
            <p style={{ margin: "4px 0", color: "#6b7280", fontSize: 14 }}>
              📍 {seller.city}
            </p>
          )}
          {seller?.email && (
            <p style={{ margin: "4px 0", color: "#6b7280", fontSize: 14 }}>
              ✉️ {seller.email}
            </p>
          )}
        </div>

        {/* Bouton contacter le vendeur — visible pour les buyers connectés */}
        {isAuthenticated && isBuyer && id && (
          <Link
            to={`/messages/${id}`}
            style={{
              textDecoration: "none",
              background: "#2563eb",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            💬 Écrire un message
          </Link>
        )}
      </div>

      {/* Produits du vendeur */}
      <h2>Produits du vendeur</h2>
      <ProductGrid products={productsData.items} loading={false} error="" />
      <Pagination
        currentPage={productsData.currentPage}
        lastPage={productsData.lastPage}
        onPageChange={setProductsPage}
      />

      {/* Avis */}
      <div style={{ marginTop: 32 }}>
        <h2>Avis clients ({sellerReviewsData.items.length})</h2>
        <ReviewList reviews={sellerReviewsData.items} />
        <Pagination
          currentPage={sellerReviewsData.currentPage}
          lastPage={sellerReviewsData.lastPage}
          onPageChange={setReviewsPage}
        />
      </div>
    </section>
  );
}
