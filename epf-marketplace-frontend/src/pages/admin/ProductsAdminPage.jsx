// src/pages/admin/ProductsAdminPage.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminProductsTable from "../../components/admin/AdminProductsTable";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import { adminService } from "../../services/adminService";

const STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "draft", label: "Brouillons" },
  { value: "published", label: "Publiés" },
  { value: "sold", label: "Vendus" },
];

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50];

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

  const [filters, setFilters] = useState({
    searchInput: "",
    search: "",
    status: "",
    perPage: 10,
    page: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyProductId, setBusyProductId] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const payload = await adminService.getProducts({
        page: filters.page,
        perPage: filters.perPage,
        search: filters.search,
        status: filters.status,
      });

      setProducts(payload.products);
      setPagination(payload.pagination);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Impossible de charger les produits à modérer."
      );
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.perPage, filters.search, filters.status]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setFilters((current) => ({
      ...current,
      search: current.searchInput.trim(),
      page: 1,
    }));
  };

  const handleStatusChange = async (product, nextStatus) => {
    try {
      setBusyProductId(product.id);
      const response = await adminService.updateProductStatus(product.id, nextStatus);
      toast.success(response?.message || "Statut produit mis à jour.");
      await loadProducts();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "La mise à jour du statut a échoué."
      );
    } finally {
      setBusyProductId(null);
    }
  };

  const handleForceDelete = async (product) => {
    const confirmed = window.confirm(
      `Supprimer définitivement le produit "${product?.title || product?.name || "Sans titre"}" ?`
    );

    if (!confirmed) return;

    try {
      setBusyProductId(product.id);
      const response = await adminService.forceDeleteProduct(product.id);
      toast.success(response?.message || "Produit supprimé définitivement.");
      await loadProducts();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "La suppression forcée a échoué."
      );
    } finally {
      setBusyProductId(null);
    }
  };

  const resultLabel = useMemo(() => {
    if (!pagination.total) return "0 produit";
    return `${pagination.total} produit${pagination.total > 1 ? "s" : ""}`;
  }, [pagination.total]);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <h1>Modération des produits</h1>
        </div>

        <button type="button" className="outline-button" onClick={loadProducts}>
          Recharger
        </button>
      </div>

      <div className="app-card" style={{ display: "grid", gap: 16 }}>
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: 16,
            alignItems: "end",
          }}
        >
          <label className="form-field">
            <span>Recherche</span>
            <input
              className="form-input"
              value={filters.searchInput}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  searchInput: event.target.value,
                }))
              }
              placeholder="Nom produit, vendeur, catégorie..."
            />
          </label>

          <label className="form-field">
            <span>Statut</span>
            <select
              className="form-input"
              value={filters.status}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  status: event.target.value,
                  page: 1,
                }))
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Éléments par page</span>
            <select
              className="form-input"
              value={filters.perPage}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  perPage: Number(event.target.value),
                  page: 1,
                }))
              }
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="primary-button">
            Rechercher
          </button>
        </form>

        <div style={{ color: "#64748b", fontWeight: 700 }}>{resultLabel}</div>
      </div>

      {loading ? <Loader text="Chargement des produits..." /> : null}
      {!loading ? <ErrorMessage message={error} /> : null}

      {!loading && !error && products.length === 0 ? (
        <EmptyState
          title="Aucun produit trouvé"
          description="Aucun produit ne correspond aux filtres de modération."
          actionLabel="Réinitialiser"
          actionTo="/admin/products"
        />
      ) : null}

      {!loading && !error && products.length > 0 ? (
        <div className="app-card" style={{ display: "grid", gap: 18 }}>
          <AdminProductsTable
            products={products}
            busyProductId={busyProductId}
            onStatusChange={handleStatusChange}
            onForceDelete={handleForceDelete}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <p style={{ margin: 0, color: "#64748b" }}>
              Page {pagination.current_page} sur {pagination.last_page}
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                className="outline-button"
                disabled={filters.page <= 1}
                style={{ opacity: filters.page <= 1 ? 0.5 : 1 }}
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    page: current.page - 1,
                  }))
                }
              >
                Précédent
              </button>

              <button
                type="button"
                className="outline-button"
                disabled={filters.page >= pagination.last_page}
                style={{ opacity: filters.page >= pagination.last_page ? 0.5 : 1 }}
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    page: current.page + 1,
                  }))
                }
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}