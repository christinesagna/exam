import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/catalog/ProductCard";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import { favoriteService } from "../../services/favoriteService";

function normalizeFavorites(payload) {
  const root = payload?.data ?? payload ?? {};
  const raw =
    root?.favorites ??
    root?.items ??
    root?.data ??
    (Array.isArray(root) ? root : []);

  return Array.isArray(raw)
    ? raw.map((item) => item?.product || item)
    : [];
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hasFavorites = useMemo(() => favorites.length > 0, [favorites]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await favoriteService.listFavorites();
        setFavorites(normalizeFavorites(data));
      } catch {
        setError("Impossible de charger les favoris.");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  return (
    <section>
      <h1 style={{ marginTop: 0 }}>Mes favoris</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Retrouve rapidement les produits que tu as enregistrés.
      </p>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && !hasFavorites && (
        <EmptyState
          title="Aucun favori"
          message="Ajoute des produits aux favoris depuis le catalogue ou la fiche produit."
        />
      )}

      {!loading && !error && hasFavorites && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
