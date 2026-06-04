import { Link } from "react-router-dom";

export default function UsersPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Gestion des utilisateurs</p>
          <h1>Utilisateurs</h1>
          <p className="page-subtitle">Affichez et gérez les comptes utilisateurs enregistrés.</p>
        </div>
      </div>

      <div className="app-card">
        <p>L'administration des utilisateurs n'est pas encore opérationnelle.</p>
        <Link to="/admin">Retour au tableau de bord</Link>
      </div>
    </section>
  );
}
