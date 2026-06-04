import { Link } from "react-router-dom";

export default function SellerDashboardPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Espace vendeur</p>
          <h1>Tableau de bord vendeur</h1>
          <p className="page-subtitle">Gérez vos produits et suivez vos ventes.</p>
        </div>
      </div>

      <div className="app-card">
        <p>Fonctionnalité de tableau de bord vendeur à venir.</p>
        <Link to="/seller/products">Voir mes produits</Link>
      </div>
    </section>
  );
}
