import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
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

        // Construire le payload en envoyant uniquement les valeurs non vides
        const payload = {};
        if (params.q) payload.q = params.q;
        if (params.category_id) payload.category_id = params.category_id;
        // L'API Laravel peut accepter price_min/price_max ou min_price/max_price
        // On envoie les deux pour compatibilité
        if (params.min_price) {
          payload.min_price = params.min_price;
          payload.price_min = params.min_price;
        }
        if (params.max_price) {
          payload.max_price = params.max_price;
          payload.price_max = params.max_price;
        }
        if (params.sort) payload.sort = params.sort;
        if (params.page > 1) payload.page = params.page;

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
          marginTop: 16,
        }}
      >
        <ProductFilters
          categories={categories}
          values={params}
          onChange={(nextValues) => updateParams({ ...nextValues, page: 1 })}
          onReset={resetParams}
        />

        <div>
          {/* Résumé des filtres actifs */}
          {(params.min_price || params.max_price || params.sort || params.category_id) && (
            <div style={{
              marginBottom: 12,
              padding: "8px 14px",
              background: "#eff6ff",
              borderRadius: 10,
              fontSize: 13,
              color: "#1d4ed8",
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}>
              <strong>Filtres :</strong>
              {params.category_id && <span>Catégorie sélectionnée</span>}
              {params.min_price && <span>Prix min : {params.min_price} FCFA</span>}
              {params.max_price && <span>Prix max : {params.max_price} FCFA</span>}
              {params.sort && <span>Tri : {params.sort}</span>}
              <button
                onClick={resetParams}
                style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontWeight: 700 }}
              >
                <FontAwesomeIcon icon={faTimes} /> Effacer
              </button>
            </div>
          )}

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
