import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBox } from "@fortawesome/free-solid-svg-icons";
import { getMyProducts, deleteProduct } from "../../services/productService";
 
export default function SellerProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [deletingId, setDeletingId] = useState(null);
 
  useEffect(() => {
    setLoading(true);
    getMyProducts({ page, per_page: 10 })
      .then((res) => {
        setProducts(res.data.data ?? []);
        setPagination(res.data.pagination ?? {});
      })
      .catch(() => setError("Impossible de charger tes produits."))
      .finally(() => setLoading(false));
  }, [page]);
 
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit définitivement ?")) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setPagination((p) => ({ ...p, total: Math.max(0, (p.total ?? 1) - 1) }));
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
    }
  };
 
  const statusLabel = (s) => ({
    active:   { label: "Actif",    bg: "#dcfce7", color: "#16a34a" },
    inactive: { label: "Inactif",  bg: "#f3f4f6", color: "#6b7280" },
    pending:  { label: "En attente", bg: "#fef9c3", color: "#ca8a04" },
  }[s] ?? { label: s, bg: "#f3f4f6", color: "#6b7280" });
 
  return (
    <div style={{ padding: "24px 32px", maxWidth: 1000, margin: "0 auto" }}>
      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Mes produits</h1>
          {!loading && (
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
              {pagination.total ?? products.length} produit(s)
            </p>
          )}
        </div>
        <button
          onClick={() => navigate("/seller/products/new")}
          style={{
            padding: "10px 20px", background: "#2563eb", color: "#fff",
            border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14,
          }}
        >
          + Nouveau produit
        </button>
      </div>
 
      {loading && <p style={{ color: "#6b7280" }}>Chargement…</p>}
      {error   && (
        <div style={{ padding: 14, background: "#fef2f2", borderRadius: 8, color: "#b91c1c", marginBottom: 16 }}>
          {error}
        </div>
      )}
 
      {/* État vide */}
      {!loading && products.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}><FontAwesomeIcon icon={faBox} /></div>
          <p style={{ fontSize: 16, fontWeight: 500 }}>Aucun produit pour le moment</p>
          <button
            onClick={() => navigate("/seller/products/new")}
            style={{
              marginTop: 16, padding: "10px 24px", background: "#2563eb",
              color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
            }}
          >
            Créer mon premier produit
          </button>
        </div>
      )}
 
      {/* Tableau des produits */}
      {!loading && products.length > 0 && (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Produit", "Prix", "Stock", "Statut", "Ventes", "Actions"].map((h) => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: 12, fontWeight: 600, color: "#6b7280",
                    borderBottom: "1px solid #e5e7eb",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const st = statusLabel(p.status);
                return (
                  <tr
                    key={p.id}
                    style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}
                  >
                    {/* Produit */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 8,
                          background: "#e5e7eb", overflow: "hidden", flexShrink: 0,
                        }}>
                          {p.images?.[0]?.url && (
                            <img src={p.images[0].url} alt=""
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          )}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{p.title}</p>
                          {p.category?.name && (
                            <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{p.category.name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Prix */}
                    <td style={{ padding: "14px 16px", fontSize: 14 }}>
                      <span style={{ fontWeight: 600 }}>{Number(p.effective_price ?? p.price).toFixed(2)} €</span>
                      {p.is_on_sale && (
                        <span style={{ display: "block", fontSize: 11, color: "#ef4444" }}>Promo</span>
                      )}
                    </td>
                    {/* Stock */}
                    <td style={{ padding: "14px 16px", fontSize: 14 }}>
                      <span style={{ color: p.stock === 0 ? "#ef4444" : "#111" }}>
                        {p.stock ?? "—"}
                      </span>
                    </td>
                    {/* Statut */}
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        background: st.bg, color: st.color,
                        padding: "3px 10px", borderRadius: 20,
                        fontSize: 12, fontWeight: 500,
                      }}>
                        {st.label}
                      </span>
                    </td>
                    {/* Ventes */}
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "#6b7280" }}>
                      {p.sales_count ?? 0}
                    </td>
                    {/* Actions */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => navigate(`/seller/products/${p.id}/edit`)}
                          style={{
                            padding: "5px 12px", background: "#eff6ff",
                            color: "#2563eb", border: "1px solid #bfdbfe",
                            borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 500,
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          style={{
                            padding: "5px 12px", background: "#fef2f2",
                            color: "#b91c1c", border: "1px solid #fca5a5",
                            borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 500,
                          }}
                        >
                          {deletingId === p.id ? "…" : "Supprimer"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
 
          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 16px", borderTop: "1px solid #e5e7eb", background: "#f9fafb",
            }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={paginBtnStyle(page === 1)}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Précédent
              </button>
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                Page {pagination.current_page} / {pagination.last_page}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                disabled={page === pagination.last_page}
                style={paginBtnStyle(page === pagination.last_page)}
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
 
const paginBtnStyle = (disabled) => ({
  padding: "7px 14px", fontSize: 13,
  background: disabled ? "#f3f4f6" : "#fff",
  color: disabled ? "#d1d5db" : "#374151",
  border: "1px solid #e5e7eb", borderRadius: 6,
  cursor: disabled ? "default" : "pointer",
});