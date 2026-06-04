import { Link } from "react-router-dom";

export default function MyProductsPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Mes produits</p>
          <h1>Liste de mes produits</h1>
          <p className="page-subtitle">Gérez vos offres publiques sur la marketplace.</p>
        </div>
      </div>

      <div className="app-card">
        <p>La gestion des produits n'est pas encore disponible dans cette version.</p>
        <Link to="/seller">Retour au tableau de bord</Link>
      </div>
    </section>
  );
}
