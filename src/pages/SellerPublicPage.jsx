import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSellerProfile,
  getSellerProducts,
  getSellerReviews,
} from "../services/productService";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
 
export default function SellerPublicPage() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [seller, setSeller]   = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews]  = useState([]);
  const [prodPagination, setProdPagination] = useState({ current_page: 1, last_page: 1 });
  const [revPagination, setRevPagination]   = useState({ current_page: 1, last_page: 1 });
  const [prodPage, setProdPage] = useState(1);
  const [revPage, setRevPage]   = useState(1);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState(null);
  const [tab, setTab]          = useState("products"); // "products" | "reviews"
 
  // Chargement du profil vendeur
  useEffect(() => {
    setLoading(true);
    getSellerProfile(id)
      .then((res) => setSeller(res.data.data ?? res.data))
      .catch(() => setError("Vendeur introuvable."))
      .finally(() => setLoading(false));
  }, [id]);
 
  // Chargement des produits du vendeur
  useEffect(() => {
    getSellerProducts(id, { page: prodPage, per_page: 12 })
      .then((res) => {
        setProducts(res.data.data ?? []);
        setProdPagination(res.data.pagination ?? {});
      })
      .catch(() => {});
  }, [id, prodPage]);
 
  // Chargement des avis du vendeur
  useEffect(() => {
    getSellerReviews(id, { page: revPage, per_page: 10 })
      .then((res) => {
        setReviews(res.data.data ?? []);
        setRevPagination(res.data.pagination ?? {});
      })
      .catch(() => {});
  }, [id, revPage]);
 
  if (loading) return <p style={{ padding: 40, color: "#6b7280" }}>Chargement…</p>;
  if (error)   return <p style={{ padding: 40, color: "#b91c1c" }}>{error}</p>;
  if (!seller) return null;
 
  const avgRating = seller.average_rating ? Number(seller.average_rating).toFixed(1) : null;
 
  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Retour */}
      <button
        onClick={() => navigate(-1)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 14, marginBottom: 20 }}
      >
        ← Retour
      </button>
 
      {/* En-tête vendeur */}
      <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 32, padding: 24, background: "#f9fafb", borderRadius: 16 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "#e5e7eb",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, fontWeight: 700, color: "#374151", flexShrink: 0,
        }}>
          {seller.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{seller.name}</h1>
          {seller.location && (
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#6b7280" }}>📍 {seller.location}</p>
          )}
          <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#6b7280" }}>
            {avgRating && <span>⭐ {avgRating} / 5</span>}
            {seller.sales_count > 0 && <span>🛒 {seller.sales_count} ventes</span>}
            {seller.products_count > 0 && <span>📦 {seller.products_count} produits</span>}
          </div>
        </div>
      </div>
 
      {/* Onglets */}
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb", marginBottom: 24 }}>
        {["products", "reviews"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 24px",
              background: "none",
              border: "none",
              borderBottom: tab === t ? "2px solid #2563eb" : "2px solid transparent",
              marginBottom: -2,
              cursor: "pointer",
              fontWeight: tab === t ? 600 : 400,
              color: tab === t ? "#2563eb" : "#6b7280",
              fontSize: 14,
            }}
          >
            {t === "products" ? "Produits" : "Avis reçus"}
          </button>
        ))}
      </div>
 
      {/* Contenu onglet Produits */}
      {tab === "products" && (
        <>
          {products.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Ce vendeur n'a pas encore de produits.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={(prod) => navigate(`/products/${prod.id}`)}
                />
              ))}
            </div>
          )}
          {prodPagination.last_page > 1 && (
            <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
              <Pagination
                currentPage={prodPagination.current_page}
                lastPage={prodPagination.last_page}
                onPageChange={setProdPage}
              />
            </div>
          )}
        </>
      )}
 
      {/* Contenu onglet Avis */}
      {tab === "reviews" && (
        <>
          {reviews.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Aucun avis pour ce vendeur.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{r.user?.name ?? "Anonyme"}</span>
                    <span style={{ color: "#f59e0b" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  </div>
                  {r.comment && <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>{r.comment}</p>}
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: "#9ca3af" }}>
                    {new Date(r.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          )}
          {revPagination.last_page > 1 && (
            <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
              <Pagination
                currentPage={revPagination.current_page}
                lastPage={revPagination.last_page}
                onPageChange={setRevPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}