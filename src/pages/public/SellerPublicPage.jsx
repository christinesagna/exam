import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import ProductGrid from "../../components/catalog/ProductGrid";
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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSellerPage = async () => {
      try {
        setLoading(true);
        setError("");

        const [sellerData, sellerProducts] = await Promise.all([
          productService.getSellerPublic(id),
          productService.getSellerProducts(id, { page }),
        ]);

        setSeller(sellerData);
        setProductsData(sellerProducts);
      } catch {
        setError("Impossible de charger la page publique du vendeur.");
      } finally {
        setLoading(false);
      }
    };

    loadSellerPage();
  }, [id, page]);

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
        onPageChange={setPage}
      />
    </section>
  );
}
