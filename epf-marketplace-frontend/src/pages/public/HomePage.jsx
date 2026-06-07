import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/catalog/SearchBar";
import ProductGrid from "../../components/catalog/ProductGrid";
import { productService } from "../../services/productService";

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

        const result = await productService.list({ page: 1 });
        setProducts(result.items.slice(0, 8));
      } catch {
        setError("Impossible de charger les produits mis en avant.");
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <section>
      <div
        style={{
          padding: "32px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Bienvenue sur EPF Marketplace</h1>
        <p style={{ color: "#374151" }}>
          Découvre les produits, recherche rapidement et consulte les vendeurs.
        </p>

        <SearchBar
          onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
          placeholder="Rechercher un produit, une catégorie..."
        />
      </div>

      <h2>Produits récents</h2>
      <ProductGrid products={products} loading={loading} error={error} />
    </section>
  );
}
