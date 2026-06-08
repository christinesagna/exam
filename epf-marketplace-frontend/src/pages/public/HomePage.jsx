import { Link } from "react-router-dom";
import TopSellingSection from "../../components/catalog/TopSellingSection";

export default function HomePage() {
  return (
    <>
      <section className="page-section">
        <div className="app-card" style={{ padding: 32 }}>
          <div className="page-header">
            <div>
              <p className="eyebrow">Bienvenue sur la marketplace</p>
              <h1>Découvrez des produits locaux</h1>
              <p className="page-subtitle">
                Recherchez, filtrez et explorez les meilleures offres disponibles.
              </p>

              <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/products" className="button">
                  Parcourir le catalogue
                </Link>

                <Link to="/search?q=" className="outline-button">
                  Lancer une recherche
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TopSellingSection />
    </>
  );
}
