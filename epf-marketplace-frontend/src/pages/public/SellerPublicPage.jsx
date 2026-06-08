import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import ProductGrid from "../../components/catalog/ProductGrid";
import Pagination from "../../components/catalog/Pagination";
import ReviewList from "../../components/catalog/ReviewList";
import { productService } from "../../services/productService";

export default function SellerPublicPage() {
  const { id } = useParams();

  const [seller, setSeller] = useState(null);
  const [tab, setTab] = useState("products");
  const [productsData, setProductsData] = useState({ items: [], currentPage: 1, lastPage: 1, total: 0 });
  const [reviewsData, setReviewsData] = useState({ items: [], currentPage: 1, lastPage: 1, total: 0 });
  const [productPage, setProductPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSeller = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await productService.getSellerPublic(id);
        setSeller(data);
      } catch {
        setError("Impossible de charger la page publique du vendeur.");
      } finally {
        setLoading(false);
      }
    };

    loadSeller();
  }, [id]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getSellerProducts(id, { page: productPage, per_page: 8 });
        setProductsData(data);
      } catch {
        setProductsData({ items: [], currentPage: 1, lastPage: 1, total: 0 });
      }
    };

    loadProducts();
  }, [id, productPage]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await productService.getSellerReviews(id, { page: reviewPage, per_page: 5 });
        setReviewsData(data);
      } catch {
        setReviewsData({ items: [], currentPage: 1, lastPage: 1, total: 0 });
      }
    };

    loadReviews();
  }, [id, reviewPage]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!seller) return <ErrorMessage message="Vendeur introuvable." />;

  return (
    <section style={{ display: "grid", gap: 24 }}>
      <div style={{ padding: 24, borderRadius: 18, background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <h1 style={{ marginTop: 0 }}>{seller.shop_name || seller.name || "Vendeur"}</h1>
        <p style={{ color: "#475569", lineHeight: 1.7 }}>
          {seller.bio || seller.description || "Aucune description disponible pour ce vendeur."}
        </p>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", color: "#64748b", fontSize: 14 }}>
          <span>{seller.products_count || productsData.total} produit(s)</span>
          <span>{seller.sales_count || 0} vente(s)</span>
          <span>{reviewsData.total} avis</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          onClick={() => setTab("products")}
          style={tabStyle(tab === "products")}
        >
          Produits
        </button>
        <button
          type="button"
          onClick={() => setTab("reviews")}
          style={tabStyle(tab === "reviews")}
        >
          Avis vendeur
        </button>
      </div>

      {tab === "products" ? (
        <div style={{ padding: 24, borderRadius: 18, background: "#ffffff", border: "1px solid #e2e8f0" }}>
          <h2 style={{ marginTop: 0 }}>Produits du vendeur</h2>
          <ProductGrid products={productsData.items} loading={false} error="" />
          <Pagination
            currentPage={productsData.currentPage}
            lastPage={productsData.lastPage}
            onPageChange={setProductPage}
          />
        </div>
      ) : (
        <div style={{ padding: 24, borderRadius: 18, background: "#ffffff", border: "1px solid #e2e8f0" }}>
          <h2 style={{ marginTop: 0 }}>Avis du vendeur</h2>
          <ReviewList reviews={reviewsData.items} />
          <Pagination
            currentPage={reviewsData.currentPage}
            lastPage={reviewsData.lastPage}
            onPageChange={setReviewPage}
          />
        </div>
      )}
    </section>
  );
}

function tabStyle(active) {
  return {
    border: active ? "1px solid #2563eb" : "1px solid #cbd5e1",
    background: active ? "#dbeafe" : "#fff",
    color: active ? "#1d4ed8" : "#334155",
    padding: "10px 18px",
    borderRadius: 999,
    cursor: "pointer",
    fontWeight: 600,
  };
}
