import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import { productService } from "../../services/productService";

export default function TopSellingSection() {
  const [data, setData] = useState({
    items: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTopSelling = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await productService.getTopSelling(8);
        setData(result);
      } catch {
        setError("Impossible de charger les meilleures ventes.");
      } finally {
        setLoading(false);
      }
    };

    loadTopSelling();
  }, []);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Top selling</p>
          <h2>Produits les plus vendus</h2>
          <p className="page-subtitle">
            Une sélection des produits les plus demandés sur la marketplace.
          </p>
        </div>

        <Link to="/products" className="outline-button">
          Voir tout le catalogue
        </Link>
      </div>

      <ProductGrid products={data.items} loading={loading} error={error} />
    </section>
  );
}
