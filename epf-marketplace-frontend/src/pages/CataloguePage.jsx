import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { getProducts, getCategories } from "../services/productService";
 
export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();
 
  // État des filtres synchronisé avec l'URL
  const [filters, setFilters] = useState({
    category_id: searchParams.get("category_id") || "",
    min_price:   searchParams.get("min_price")   || "",
    max_price:   searchParams.get("max_price")   || "",
    sort:        searchParams.get("sort")         || "newest",
    q:           searchParams.get("q")            || "",
  });
  const [page, setPage]           = useState(Number(searchParams.get("page")) || 1);
  const [products, setProducts]   = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
 
  // Chargement des catégories une seule fois
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data ?? res.data))
      .catch(() => {});
  }, []);
 
  // Chargement des produits à chaque changement de filtres ou de page
  useEffect(() => {
    const params = { page, per_page: 12 };
    if (filters.category_id) params.category_id = filters.category_id;
    if (filters.min_price)   params.min_price   = filters.min_price;
    if (filters.max_price)   params.max_price   = filters.max_price;
    if (filters.sort)        params.sort        = filters.sort;
    if (filters.q)           params.q           = filters.q;
 
    // Synchronise l'URL
    setSearchParams(params);
 
    setLoading(true);
    setError(null);
    getProducts(params)
      .then((res) => {
        setProducts(res.data.data ?? []);
        setPagination(res.data.pagination ?? {});
      })
      .catch(() => setError("Impossible de charger les produits."))
      .finally(() => setLoading(false));
  }, [filters, page]);
 
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // retour à la page 1 à chaque nouveau filtre
  };
 
  const handleReset = () => {
    setFilters({ category_id: "", min_price: "", max_price: "", sort: "newest", q: "" });
    setPage(1);
  };
 
  const handleSearch = (query) => {
    setFilters((f) => ({ ...f, q: query }));
    setPage(1);
  };
 
  return (
    <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>
      {/* En-tête */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 16px" }}>Catalogue</h1>
        <SearchBar defaultValue={filters.q} onSearch={handleSearch} />
      </div>
 
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Filtres */}
        <FilterPanel
          filters={filters}
          categories={categories}
          onChange={handleFilterChange}
          onReset={handleReset}
        />
 
        {/* Contenu principal */}
        <div style={{ flex: 1 }}>
          {/* Résumé */}
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
            {loading ? "Chargement…" : `${pagination.total ?? 0} produit(s) trouvé(s)`}
          </p>
 
          {/* Erreur */}
          {error && (
            <div style={{ padding: 16, background: "#fef2f2", borderRadius: 8, color: "#b91c1c", marginBottom: 16 }}>
              {error}
            </div>
          )}
 
          {/* Grille produits */}
          {!loading && !error && products.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              {loading
                ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                : products.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onClick={(product) => (window.location.href = `/products/${product.id}`)}
                    />
                  ))}
            </div>
          )}
 
          {/* Pagination */}
          {!loading && pagination.last_page > 1 && (
            <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
              <Pagination
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
//  Composants internes 
 
function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🛍️</div>
      <p style={{ fontSize: 16, fontWeight: 500 }}>Aucun produit trouvé</p>
      <p style={{ fontSize: 13 }}>Essaie de modifier tes filtres ou ta recherche.</p>
    </div>
  );
}
 
function SkeletonCard() {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        background: "#f9fafb",
      }}
    >
      <div style={{ paddingTop: "66%", background: "#e5e7eb" }} />
      <div style={{ padding: 14 }}>
        <div style={{ height: 14, background: "#e5e7eb", borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 12, background: "#f3f4f6", borderRadius: 4, width: "60%" }} />
      </div>
    </div>
  );
}
