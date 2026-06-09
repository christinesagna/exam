import { useEffect, useState } from "react";
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
  const [productsData, setProductsData] = useState({
    items: [],
    currentPage: 1,
    lastPage: 1,
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
    <section>
      <h1>{title}</h1>

      <SearchBar
        initialValue={params.q}
        onSearch={(q) => updateParams({ q, page: 1 })}
      />

      <CategoryList
        categories={categories}
        activeCategory={params.category_id}
        onSelect={(categoryId) => updateParams({ category_id: categoryId, page: 1 })}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <ProductFilters
          categories={categories}
          values={params}
          onChange={(nextValues) => updateParams({ ...nextValues, page: 1 })}
          onReset={resetParams}
        />

        <div>
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
