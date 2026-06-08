import { useEffect, useState } from "react";
import SearchBar from "../../components/catalog/SearchBar";
import CategoryList from "../../components/catalog/CategoryList";
import ProductFilters from "../../components/catalog/ProductFilters";
import ProductGrid from "../../components/catalog/ProductGrid";
import Pagination from "../../components/catalog/Pagination";
import { useCatalogParams } from "../../hooks/useCatalogParams";
import { productService } from "../../services/productService";

export default function ProductsPage({ title = "Catalogue" }) {
  const { params, updateParams, resetParams, setPage } = useCatalogParams();

  const [categories, setCategories] = useState([]);
  const [productsData, setProductsData] = useState({
    items: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        if (
          params.min_price &&
          params.max_price &&
          Number(params.min_price) > Number(params.max_price)
        ) {
          setError("Le prix minimum ne peut pas être supérieur au prix maximum.");
          setProductsData({
            items: [],
            currentPage: 1,
            lastPage: 1,
            total: 0,
          });
          return;
        }

        const payload = {
          q: params.q || undefined,
          category_id: params.category_id || undefined,
          min_price: params.min_price || undefined,
          max_price: params.max_price || undefined,
          sort: params.sort || undefined,
          page: params.page || 1,
        };

        const result = params.q
          ? await productService.search(payload)
          : await productService.list(payload);

        setProductsData(result);
      } catch {
        setError("Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [
    params.q,
    params.category_id,
    params.min_price,
    params.max_price,
    params.sort,
    params.page,
  ]);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Catalogue public</p>
          <h1>{title}</h1>
          <p className="page-subtitle">
            Parcourez le catalogue et trouvez rapidement un produit.
          </p>
        </div>
      </div>

      <div className="app-card" style={{ marginBottom: 20 }}>
        <SearchBar
          key={params.q || "catalog-search"}
          initialValue={params.q}
          onSearch={(q) => updateParams({ q, page: 1 })}
        />

        <CategoryList
          categories={categories}
          activeCategory={params.category_id}
          onSelect={(categoryId) => updateParams({ category_id: categoryId, page: 1 })}
        />
      </div>

      <div className="catalog-layout">
        <ProductFilters
          categories={categories}
          values={params}
          onChange={(nextValues) => updateParams({ ...nextValues, page: 1 })}
          onReset={resetParams}
        />

        <div>
          <div className="app-card" style={{ marginBottom: 16 }}>
            <strong>{productsData.total}</strong> produit(s) trouvé(s)
          </div>

          <ProductGrid
            products={productsData.items}
            loading={loading}
            error={error}
          />

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
