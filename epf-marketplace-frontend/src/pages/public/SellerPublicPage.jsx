import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import ProductGrid from "../../components/catalog/ProductGrid";
import ReviewList from "../../components/catalog/ReviewList";
import Pagination from "../../components/catalog/Pagination";
import { productService } from "../../services/productService";

export default function SellerPublicPage() {
  const { id } = useParams();

  const [seller, setSeller] = useState(null);

  const [productsData, setProductsData] = useState({
    items: [],
    currentPage: 1,
    lastPage: 1,
  });

  const [sellerReviewsData, setSellerReviewsData] = useState({
    items: [],
    currentPage: 1,
    lastPage: 1,
  });

  const [productsPage, setProductsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setProductsPage(1);
    setReviewsPage(1);
  }, [id]);

  useEffect(() => {
    const loadSellerPage = async () => {
      try {
        setLoading(true);
        setError("");

        const [sellerData, sellerProducts, sellerReviews] = await Promise.all([
          productService.getSellerPublic(id),
          productService.getSellerProducts(id, { page: productsPage }),
          productService.getSellerReviews(id, { page: reviewsPage }),
        ]);

        setSeller(sellerData);
        setProductsData(sellerProducts);
        setSellerReviewsData(sellerReviews);
      } catch {
        setError("Impossible de charger la page publique du vendeur.");
      } finally {
        setLoading(false);
      }
    };

    loadSellerPage();
  }, [id, productsPage, reviewsPage]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
      <div
        style={{
          padding: "24px",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          background: "#fff",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ marginTop: 0 }}>
          {seller?.shop_name || seller?.name || "Vendeur"}
        </h1>

        <p style={{ color: "#4b5563" }}>
          {seller?.bio || seller?.description || "Aucune description disponible."}
        </p>

        {seller?.email && (
          <p>
            <strong>Email :</strong> {seller.email}
          </p>
        )}
      </div>

      <h2>Produits du vendeur</h2>

      <ProductGrid
        products={productsData.items}
        loading={false}
        error=""
      />

      <Pagination
        currentPage={productsData.currentPage}
        lastPage={productsData.lastPage}
        onPageChange={setProductsPage}
      />

      <div style={{ marginTop: "32px" }}>
        <h2>Avis vendeur</h2>

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
