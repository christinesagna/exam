import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductGrid from "../../components/catalog/ProductGrid";
import Loader from "../../components/common/Loader";
import { productService } from "../../services/productService";

export default function SellerPublicPage() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSeller = async () => {
      try {
        setLoading(true);
        const profile = await productService.getSellerPublic(id);
        setSeller(profile);
        const productResult = await productService.getSellerProducts(id);
        setProducts(productResult.items || []);
      } catch {
        setError("Impossible de charger le profil du vendeur.");
      } finally {
        setLoading(false);
      }
    };

    loadSeller();
  }, [id]);

  if (loading) return <Loader text="Chargement du vendeur..." />;

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Vendeur</p>
          <h1>{seller?.name || "Profil du vendeur"}</h1>
        </div>
      </div>

      {error ? (
        <div className="app-card">
          <p>{error}</p>
          <Link to="/products">Retour au catalogue</Link>
        </div>
      ) : (
        <ProductGrid products={products} loading={loading} error={error} />
      )}
    </section>
  );
}
