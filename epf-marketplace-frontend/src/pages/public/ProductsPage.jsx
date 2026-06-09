import { useEffect, useMemo, useState } from "react";
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
  const [catalogMetaError, setCatalogMetaError] = useState("");

  useEffect(() => {
    const loadStaticData = async () => {
      try {
        setCatalogMetaError("");
        const [loadedCategories, loadedTopSelling] = await Promise.all([
          productService.getCategories(),
          productService.topSelling(6),
        ]);

        setCategories(loadedCategories);
        setTopSelling(loadedTopSelling.items || []);
      } catch {
        setCategories([]);
        setTopSelling([]);
        setCatalogMetaError("Certaines données du catalogue (catégories ou top-selling) n’ont pas pu être chargées.");
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

  const activeFilters = useMemo(() => {
    const labels = [];

    if (params.q) labels.push({ key: "q", label: `Recherche : ${params.q}` });

    if (params.category_id) {
      const activeCategory = categories.find(
        (category) => String(category.id) === String(params.category_id)
      );
      labels.push({
        key: "category_id",
        label: `Catégorie : ${activeCategory?.name || params.category_id}`,
      });
    }

    if (params.min_price) labels.push({ key: "min_price", label: `Min : ${params.min_price} FCFA` });
    if (params.max_price) labels.push({ key: "max_price", label: `Max : ${params.max_price} FCFA` });

    if (params.sort) {
      const sortLabels = {
        newest: "Plus récents",
        cheapest: "Moins chers",
        popular: "Plus vendus",
        most_rated: "Mieux notés",
      };
      labels.push({ key: "sort", label: `Tri : ${sortLabels[params.sort] || params.sort}` });
    }

    return labels;
  }, [categories, params.category_id, params.max_price, params.min_price, params.q, params.sort]);

  return (
    <section style={{ display: "grid", gap: 24 }}>
      <div
        style={{
          padding: 28,
          borderRadius: 24,
          background:
            "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(59,130,246,0.08) 45%, rgba(255,255,255,0.98) 100%)",
          border: "1px solid #dbeafe",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 18,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 760 }}>
            <p
              style={{
                margin: "0 0 10px",
                color: "#2563eb",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: 12,
              }}
            >
              Marketplace publique
            </p>
            <h1 style={{ margin: "0 0 10px", fontSize: 32, lineHeight: 1.1 }}>{title}</h1>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.7, maxWidth: 720 }}>
              Explore les produits, affine rapidement par catégorie ou budget, et garde tous les paramètres dans l’URL pour un partage ou un retour facile.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <StatCard label="Catégories" value={categories.length} />
            <StatCard
              label="Produits affichés"
              value={loading ? "..." : productsData.total}
            />
            <StatCard label="Page" value={`${productsData.currentPage}/${productsData.lastPage}`} />
          </div>
        </div>

        <SearchBar
          initialValue={params.q}
          onSearch={(q) => updateParams({ q, page: 1 })}
          placeholder="Rechercher un produit, une marque ou une idée cadeau..."
        />

        {catalogMetaError && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 14,
              background: "#fff7ed",
              border: "1px solid #fdba74",
              color: "#9a3412",
              fontSize: 14,
            }}
          >
            {catalogMetaError}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {activeFilters.length > 0 ? (
            <>
              {activeFilters.map((filter) => (
                <span
                  key={filter.key}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 14px",
                    borderRadius: 999,
                    background: "#ffffff",
                    border: "1px solid #bfdbfe",
                    color: "#1d4ed8",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {filter.label}
                </span>
              ))}
              <button
                type="button"
                onClick={resetParams}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#475569",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Effacer les filtres
              </button>
            </>
          ) : (
            <span style={{ color: "#64748b", fontSize: 14 }}>
              Aucun filtre actif. Découvre le catalogue complet.
            </span>
          )}
        </div>
      </div>

      {!hasFilters && topSelling.length > 0 && (
        <div
          style={{
            padding: 22,
            borderRadius: 20,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 14px 30px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>Top-selling</h2>
              <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                Une sélection rapide des produits les plus consultés ou vendus.
              </p>
            </div>
            <Link
              to="/products"
              style={{ color: "#2563eb", textDecoration: "none", fontWeight: 700 }}
            >
              Voir tout
            </Link>
          </div>
          <ProductGrid products={topSelling} loading={false} error="" compact />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 320px) minmax(0, 1fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <aside style={{ display: "grid", gap: 18, position: "sticky", top: 92 }}>
          <CategoryList
            categories={categories}
            activeCategory={params.category_id}
            onSelect={(categoryId) => updateParams({ category_id: categoryId, page: 1 })}
          />

          <ProductFilters
            categories={categories}
            values={params}
            onChange={(nextValues) => updateParams({ ...nextValues, page: 1 })}
            onReset={resetParams}
          />
        </aside>

        <div style={{ display: "grid", gap: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              padding: "16px 18px",
              borderRadius: 18,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 20 }}>Résultats du catalogue</h2>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 14 }}>
                {loading
                  ? "Chargement des produits en cours..."
                  : `${productsData.total} produit(s) trouvé(s)`}
              </p>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 999,
                background: "#eff6ff",
                color: "#1d4ed8",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {params.page ? `Page ${params.page}` : "Page 1"}
            </div>
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

function StatCard({ label, value }) {
  return (
    <div
      style={{
        minWidth: 120,
        padding: "14px 16px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.82)",
        border: "1px solid rgba(191,219,254,0.95)",
        boxShadow: "0 10px 24px rgba(37, 99, 235, 0.08)",
      }}
    >
      <div style={{ color: "#64748b", fontSize: 12, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{value}</div>
    </div>
  );
}
