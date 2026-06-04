import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Bienvenue sur la marketplace</p>
          <h1>Découvrez des produits locaux</h1>
          <div style={{ marginTop: 24 }}>
            <Link to="/products" className="button">
              Parcourir le catalogue
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
