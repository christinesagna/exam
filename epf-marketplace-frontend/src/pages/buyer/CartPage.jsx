import { Link } from "react-router-dom";

export default function CartPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Mon panier</p>
          <h1>Panier d'achat</h1>
          <p className="page-subtitle">Gérez vos articles avant de finaliser votre commande.</p>
        </div>
      </div>

      <div className="app-card">
        <p>Fonctionnalité panier non encore implémentée dans cette version.</p>
        <Link to="/products">Retour au catalogue</Link>
      </div>
    </section>
  );
}
