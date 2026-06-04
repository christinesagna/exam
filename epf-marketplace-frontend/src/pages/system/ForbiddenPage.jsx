import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <section className="status-page">
      <div className="app-card status-card">
        <p className="eyebrow">Erreur 403</p>
        <h1>Accès interdit</h1>
        <p className="page-subtitle">
          Votre rôle ne permet pas d’accéder à cette ressource. Vérifiez votre compte ou reconnectez-vous avec un profil autorisé.
        </p>
        <div className="status-actions">
          <Link to="/">Retour à l’accueil</Link>
          <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </section>
  );
}
