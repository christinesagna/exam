import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/catalog/SearchBar";
import ProductGrid from "../../components/catalog/ProductGrid";
import { productService } from "../../services/productService";
import semLogo from "../../assets/SEM-Market.png";

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await productService.topSelling(8);
        setProducts(result.items);
      } catch {
        setError("Impossible de charger les produits les plus vendus.");
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedProducts();
  }, []);

  return (
    <section>
      {/* Hero */}
      <div className="hero-banner">
        <div className="hero-content">
          <img src={semLogo} alt="SEM Market" className="hero-logo" />
          <h1 className="hero-title">
            Bienvenue sur <span>SEM Market</span>
          </h1>
          <p className="hero-slogan">Achetez, vendez, échangez en toute simplicité.</p>
          <div className="hero-search">
            <SearchBar
              onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
              placeholder="Rechercher un produit, une catégorie..."
            />
          </div>
          <div className="hero-badges">
            <span>🛒 Achetez</span>
            <span>🏷️ Vendez</span>
            <span>🤝 Échangez</span>
          </div>
        </div>
      </div>

      <h2 className="section-title">🔥 Top des ventes</h2>
      <ProductGrid products={products} loading={loading} error={error} />
    </section>
  );
}
