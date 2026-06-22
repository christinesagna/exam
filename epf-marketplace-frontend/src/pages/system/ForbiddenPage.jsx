import { Link, useLocation } from "react-router-dom";

export default function ForbiddenPage() {
  const location = useLocation();
  const message =
    location.state?.message ||
    "Vous n’avez pas les droits nécessaires pour accéder à cette page.";

  return (
    <section className="page-section">
      <div className="app-card" style={{ maxWidth: 720, margin: "40px auto", textAlign: "center" }}>
        <p className="eyebrow">Erreur 403</p>
        <h1 style={{ marginTop: 0 }}>Accès refusé</h1>
        <p style={{ color: "#64748b", lineHeight: 1.8 }}>{message}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 24,
          }}
        >
          <Link to="/" className="outline-button" style={{ textDecoration: "none" }}>
            Retour à l’accueil
          </Link>

          <Link
            to="/login"
            className="primary-button"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
          >
            Se connecter
          </Link>
        </div>
      </div>
    </section>
  );
}
