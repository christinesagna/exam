import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { search } from "../services/productService";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
 
export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") ?? "";
 
  const [results, setResults]   = useState({ products: [], sellers: [], categories: [] });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
 
  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    search(query, "all", 20)
      .then((res) => {
        const data = res.data.data ?? res.data;
        setResults({
          products:   data.products   ?? [],
          sellers:    data.sellers    ?? [],
          categories: data.categories ?? [],
        });
      })
      .catch(() => setError("Erreur lors de la recherche."))
      .finally(() => setLoading(false));
  }, [query]);
 
  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <SearchBar defaultValue={query} />
      </div>
 
      {!query && (
        <p style={{ color: "#6b7280" }}>Tape un mot-clé pour lancer une recherche.</p>
      )}
 
      {loading && <p style={{ color: "#6b7280" }}>Recherche en cours…</p>}
      {error   && <p style={{ color: "#b91c1c" }}>{error}</p>}
 
      {!loading && query && (
        <>
          {/* Catégories */}
          {results.categories.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Catégories</h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {results.categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/catalogue?category_id=${c.id}`)}
                    style={{
                      padding: "6px 16px", background: "#eff6ff", color: "#1d4ed8",
                      border: "1px solid #bfdbfe", borderRadius: 20, cursor: "pointer", fontSize: 13,
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </section>
          )}
 
          {/* Vendeurs */}
          {results.sellers.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Vendeurs</h2>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {results.sellers.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => navigate(`/sellers/${s.id}`)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px", border: "1px solid #e5e7eb",
                      borderRadius: 10, cursor: "pointer", background: "#fff",
                      minWidth: 200,
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", background: "#e5e7eb",
                      display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                    }}>
                      {s.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{s.name}</p>
                      {s.products_count > 0 && (
                        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{s.products_count} produits</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
 
          {/* Produits */}
          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
              Produits ({results.products.length})
            </h2>
            {results.products.length === 0 ? (
              <p style={{ color: "#6b7280", fontSize: 14 }}>Aucun produit pour « {query} ».</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
                {results.products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onClick={(prod) => navigate(`/products/${prod.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}