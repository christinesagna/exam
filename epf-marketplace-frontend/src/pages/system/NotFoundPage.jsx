import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="status-page">
      <div className="app-card status-card">
        <p className="eyebrow">Erreur 404</p>
        <h1>Page introuvable</h1>
        <p className="page-subtitle">
          Le contenu demandé n’existe pas ou a été déplacé. Revenez au catalogue ou à la page d’accueil.
        </p>
        <div className="status-actions">
          <Link to="/">Accueil</Link>
          <Link to="/products">Catalogue</Link>
        </div>
      </div>
    </section>
  );
}
