import { Link } from "react-router-dom";

export default function ProductsAdminPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Gestion des produits</p>
          <h1>Produits administrateur</h1>
          <p className="page-subtitle">Liste et contrôle des produits enregistrés sur la marketplace.</p>
        </div>
      </div>

      <div className="app-card">
        <p>Interface d'administration des produits en cours de construction.</p>
        <Link to="/admin">Retour au tableau de bord</Link>
      </div>
    </section>
  );
}
