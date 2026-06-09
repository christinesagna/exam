import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFavorites, removeFavorite } from "../../services/favoriteService";
import ProductCard from "../../components/ProductCard";
 
export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
 
  useEffect(() => {
    setLoading(true);
    getFavorites()
      .then((res) => setFavorites(res.data.data ?? res.data))
      .catch(() => setError("Impossible de charger tes favoris."))
      .finally(() => setLoading(false));
  }, []);
 
  const handleRemove = async (productId) => {
    try {
      await removeFavorite(productId);
      setFavorites((prev) => prev.filter((f) => f.id !== productId));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };
 
  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
        ❤️ Mes favoris ({favorites.length})
      </h1>
 
      {/* Chargement */}
      {loading && <p style={{ color: "#6b7280" }}>Chargement…</p>}
 
      {/* Erreur */}
      {error && (
        <div style={{ padding: 16, background: "#fef2f2", borderRadius: 8, color: "#b91c1c" }}>
          {error}
        </div>
      )}
 
      {/* État vide */}
      {!loading && !error && favorites.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🤍</div>
          <p style={{ fontSize: 16, fontWeight: 500 }}>Aucun favori pour le moment</p>
          <p style={{ fontSize: 13, marginBottom: 20 }}>
            Ajoute des produits à tes favoris depuis le catalogue.
          </p>
          <button
            onClick={() => navigate("/catalogue")}
            style={{
              padding: "10px 24px", background: "#2563eb", color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
            }}
          >
            Voir le catalogue
          </button>
        </div>
      )}
 
      {/* Grille des favoris */}
      {!loading && favorites.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
        }}>
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={true}
              onToggleFavorite={handleRemove}
              onClick={(p) => navigate(`/products/${p.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}