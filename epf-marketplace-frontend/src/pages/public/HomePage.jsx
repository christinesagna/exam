import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../../components/catalog/SearchBar";
import ProductGrid from "../../components/catalog/ProductGrid";
import CategoryList from "../../components/catalog/CategoryList";
import Footer from "../../components/layout/Footer";
import { productService } from "../../services/productService";
import { useAuth } from "../../hooks/useAuth";

const categoryIcons = {
  electronique: "🎧",
  electronics: "🎧",
  informatique: "💻",
  maison: "🪑",
  mode: "👗",
  loisirs: "⚽",
  livres: "📖",
  culture: "📖",
};

function getCategoryIcon(category) {
  const key = `${category?.slug || category?.name || ""}`.toLowerCase();
  const match = Object.entries(categoryIcons).find(([token]) => key.includes(token));
  return match?.[1] || "🛍️";
}

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError("");
        const [topSelling, categoryList] = await Promise.all([
          productService.topSelling(8),
          productService.getCategories(),
        ]);
        setProducts(topSelling.items);
        setCategories(categoryList);
      } catch {
        setError("Impossible de charger les donnees de la page d'accueil.");
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <section className="home-page">
      <div className="hero-banner">
        <div className="hero-content">
          <span className="hero-kicker">
            {isAuthenticated ? "ACCUEIL / BOUTIQUE" : "Bienvenue sur EPF Marketplace"}
          </span>
          <h1 className="hero-title">
            {isAuthenticated ? (
              "Découvre des produits incroyables"
            ) : (
              <>Trouvez. Achetez. Vendez. <span>Facilement.</span></>
            )}
          </h1>
          <p className="hero-slogan">
            {isAuthenticated
              ? "Achète auprès de vendeurs de confiance"
              : "La marketplace de confiance pour acheter et vendre des produits de qualite en toute securite."}
          </p>

          <div className="hero-search">
            <SearchBar
              onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
              placeholder="Rechercher un produit, une categorie, un vendeur..."
            />
          </div>

          {isAuthenticated ? (
            <div className="hero-actions">
              <Link to="/products" className="hero-primary">Voir les produits</Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/products" className="hero-primary">Decouvrir les produits</Link>
              <Link to="/seller" className="hero-secondary">Devenir vendeur</Link>
            </div>
          )}
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-cart">🛒</div>
          <span className="hero-float hero-float-like">👍</span>
          <span className="hero-float hero-float-heart">♥</span>
          <span className="hero-float hero-float-sale">%</span>
        </div>
      </div>

      <section className="home-section">
        <div className="home-section-header">
          <h2>{isAuthenticated ? "Catégories populaires" : "Parcourir par categories"}</h2>
          <Link to="/products">Voir toutes les categories →</Link>
        </div>

        <div className="home-category-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="home-category-card"
              onClick={() => navigate(`/products?category_id=${category.id}`)}
            >
              <span className="home-category-icon">{getCategoryIcon(category)}</span>
              <strong>{category.name}</strong>
              <span>{category.products_count ?? 0} produits</span>
            </button>
          ))}
        </div>
      </section>

      <div className="home-section-header home-products-header">
        <h2 className="section-title">Produits populaires</h2>
        <Link to="/products">Voir tout →</Link>
      </div>

      <ProductGrid products={products} loading={loading} error={error} />
      <Footer />
    </section>
  );
}
