import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Espace administrateur</p>
          <h1>Tableau de bord admin</h1>
          <p className="page-subtitle">Surveillez les utilisateurs, les produits et les commandes.</p>
        </div>
      </div>

      <div className="app-card">
        <p>Fonctionnalités d'administration disponibles prochainement.</p>
        <Link to="/admin/products">Gérer les produits</Link>
      </div>
    </section>
  );
}
