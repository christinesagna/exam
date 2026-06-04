import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { productService } from "../../services/productService";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getById(id);
        setProduct(data);
      } catch {
        setError("Impossible de charger le produit.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) return <Loader text="Chargement du produit..." />;

  if (error) return (
    <section className="page-section">
      <div className="app-card">
        <p>{error}</p>
        <Link to="/products">Retour au catalogue</Link>
      </div>
    </section>
  );

  return (
    <section className="page-section">
      <div className="app-card">
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            {product?.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                style={{ width: "100%", borderRadius: 16, objectFit: "cover" }}
              />
            ) : (
              <div style={{ minHeight: 260, background: "#f3f4f6", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                Image non disponible
              </div>
            )}
          </div>
          <div style={{ flex: 2, minWidth: 260 }}>
            <h1>{product?.name || "Produit"}</h1>
            <div style={{ marginTop: 20 }}>
              <p><strong>Prix :</strong> {product?.price ? `${product.price} FCFA` : "Non défini"}</p>
              <p><strong>Catégorie :</strong> {product?.category?.name || "—"}</p>
              <p><strong>Vendeur :</strong> {product?.seller?.name || "Anonyme"}</p>
            </div>
            <div style={{ marginTop: 24 }}>
              <Link to="/products" className="button">
                Retour au catalogue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
