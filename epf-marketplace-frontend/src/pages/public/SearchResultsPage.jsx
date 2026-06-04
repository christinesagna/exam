import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductGrid from "../../components/catalog/ProductGrid";
import { productService } from "../../services/productService";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSearch = async () => {
      if (!q) return;

      try {
        setLoading(true);
        setError("");
        const data = await productService.search({ q });
        setProducts(data.items || []);
      } catch {
        setError("Impossible de charger les résultats de recherche.");
      } finally {
        setLoading(false);
      }
    };

    loadSearch();
  }, [q]);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Recherche</p>
          <h1>Résultats pour « {q || "aucune recherche"} »</h1>
        </div>
      </div>

      {q ? <ProductGrid products={products} loading={loading} error={error} /> : (
        <div className="app-card">
          <p>Utilisez la barre de recherche pour trouver des produits sur la marketplace.</p>
          <Link to="/products">Retour au catalogue</Link>
        </div>
      )}
    </section>
  );
}
