import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/catalog/SearchBar";
import ProductGrid from "../../components/catalog/ProductGrid";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { productService } from "../../services/productService";

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState({
    products: [],
    sellers: [],
    categories: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResults = async () => {
      if (!query) {
        setResults({ products: [], sellers: [], categories: [] });
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await productService.searchGlobal({ q: query, type: "all", limit: 24 });
        setResults(data);
      } catch {
        setError("Impossible d’exécuter la recherche globale.");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [query]);

  return (
    <section style={{ display: "grid", gap: 24 }}>
      <div style={{ padding: 24, borderRadius: 18, background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <h1 style={{ marginTop: 0 }}>Recherche globale</h1>
        <SearchBar
          initialValue={query}
          onSearch={(q) => setSearchParams(q ? { q } : {})}
          placeholder="Produit, vendeur ou catégorie..."
        />
        {query && <p style={{ marginBottom: 0, color: "#64748b" }}>Résultats pour « {query} »</p>}
      </div>

      {!query && (
        <EmptyState
          title="Aucune recherche lancée"
          message="Saisis un mot-clé pour chercher des produits, des vendeurs et des catégories."
        />
      )}

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && query && (
        <div style={{ display: "grid", gap: 24 }}>
          <section style={{ padding: 20, borderRadius: 16, background: "#fff", border: "1px solid #e2e8f0" }}>
            <h2 style={{ marginTop: 0 }}>Catégories</h2>
            {results.categories.length === 0 ? (
              <p style={{ color: "#64748b" }}>Aucune catégorie trouvée.</p>
            ) : (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {results.categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category_id=${category.id}`}
                    style={{
                      textDecoration: "none",
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      border: "1px solid #bfdbfe",
                      padding: "8px 14px",
                      borderRadius: 999,
                    }}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section style={{ padding: 20, borderRadius: 16, background: "#fff", border: "1px solid #e2e8f0" }}>
            <h2 style={{ marginTop: 0 }}>Vendeurs</h2>
            {results.sellers.length === 0 ? (
              <p style={{ color: "#64748b" }}>Aucun vendeur trouvé.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                {results.sellers.map((seller) => (
                  <button
                    key={seller.id}
                    type="button"
                    onClick={() => navigate(`/sellers/${seller.id}`)}
                    style={{
                      textAlign: "left",
                      padding: 16,
                      border: "1px solid #e2e8f0",
                      borderRadius: 14,
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <strong>{seller.shop_name || seller.name || "Vendeur"}</strong>
                    <p style={{ margin: "8px 0 0", color: "#64748b" }}>
                      {seller.products_count || 0} produit(s)
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section style={{ padding: 20, borderRadius: 16, background: "#fff", border: "1px solid #e2e8f0" }}>
            <h2 style={{ marginTop: 0 }}>Produits</h2>
            <ProductGrid products={results.products} loading={false} error="" />
          </section>
        </div>
      )}
    </section>
  );
}
