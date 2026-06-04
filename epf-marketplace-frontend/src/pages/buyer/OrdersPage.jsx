import { Link } from "react-router-dom";

export default function OrdersPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Mes commandes</p>
          <h1>Historique des commandes</h1>
          <p className="page-subtitle">Vos achats récents apparaîtront ici.</p>
        </div>
      </div>

      <div className="app-card">
        <p>La fonctionnalité de commande n'est pas encore disponible dans cette version.</p>
        <Link to="/products">Voir le catalogue</Link>
      </div>
    </section>
  );
}
