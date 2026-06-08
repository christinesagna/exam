import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../components/catalog/SearchBar";
import CategoryList from "../../components/catalog/CategoryList";
import ProductFilters from "../../components/catalog/ProductFilters";
import ProductGrid from "../../components/catalog/ProductGrid";
import Pagination from "../../components/catalog/Pagination";
import { productService } from "../../services/productService";
import { useCatalogParams } from "../../hooks/useCatalogParams";

export default function ProductsPage({ title = "Catalogue" }) {
  const { params, updateParams, resetParams, setPage } = useCatalogParams();

  const [categories, setCategories] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [productsData, setProductsData] = useState({
    items: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const [loadedCategories, loadedTopSelling] = await Promise.all([
          productService.getCategories(),
          productService.topSelling(6),
        ]);

        setCategories(loadedCategories);
        setTopSelling(loadedTopSelling.items || []);
      } catch {
        setCategories([]);
        setTopSelling([]);
      }
    };

    loadStaticData();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const payload = {
          q: params.q || undefined,
          category_id: params.category_id || undefined,
          min_price: params.min_price || undefined,
          max_price: params.max_price || undefined,
          sort: params.sort || undefined,
          page: params.page || 1,
          per_page: 12,
        };

        const result = await productService.list(payload);
        setProductsData(result);
      } catch {
        setError("Impossible de charger le catalogue public.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [params.q, params.category_id, params.min_price, params.max_price, params.sort, params.page]);

  const hasFilters = Boolean(
    params.q || params.category_id || params.min_price || params.max_price || params.sort
  );

  return (
    <section style={{ display: "grid", gap: 24 }}>
      <div
        style={{
          padding: 24,
          borderRadius: 18,
          background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
        }}
      >
        <h1 style={{ margin: 0, marginBottom: 8 }}>{title}</h1>
        <p style={{ marginTop: 0, color: "#334155" }}>
          Explore les produits, filtre par catégorie ou prix, et garde les paramètres dans l’URL.
        </p>
        <SearchBar
          initialValue={params.q}
          onSearch={(q) => updateParams({ q, page: 1 })}
          placeholder="Rechercher un produit..."
        />
      </div>

      <CategoryList
        categories={categories}
        activeCategory={params.category_id}
        onSelect={(categoryId) => updateParams({ category_id: categoryId, page: 1 })}
      />

      {!hasFilters && topSelling.length > 0 && (
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0 }}>Top-selling</h2>
              <p style={{ margin: "6px 0 0", color: "#64748b" }}>Produits les plus consultés ou vendus.</p>
            </div>
            <Link to="/products" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>
              Voir tout
            </Link>
          </div>
          <ProductGrid products={topSelling} loading={false} error="" />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        <ProductFilters
          categories={categories}
          values={params}
          onChange={(nextValues) => updateParams({ ...nextValues, page: 1 })}
          onReset={resetParams}
        />

        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ color: "#64748b", fontSize: 14 }}>
            {loading ? "Chargement du catalogue..." : `${productsData.total} produit(s) trouvé(s)`}
          </div>

          <ProductGrid products={productsData.items} loading={loading} error={error} />

          <Pagination
            currentPage={productsData.currentPage}
            lastPage={productsData.lastPage}
            onPageChange={setPage}
          />
        </div>
      </div>
    </section>
  );
}
