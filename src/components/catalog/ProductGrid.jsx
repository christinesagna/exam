import ProductCard from "./ProductCard";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import EmptyState from "../common/EmptyState";

export default function ProductGrid({
  products = [],
  loading = false,
  error = "",
}) {
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  if (!products.length) {
    return (
      <EmptyState
        title="Aucun produit trouvé"
        message="Essaie de modifier les filtres ou la recherche."
      />
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "16px",
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
