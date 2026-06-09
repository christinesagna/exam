import { Link } from "react-router-dom";
import semLogo from "../../assets/SEM-Market.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <img src={semLogo} alt="SEM Market" className="footer-logo" />
          <p className="footer-slogan">Achetez, vendez, échangez en toute simplicité.</p>
          <p className="footer-text">Votre destination de confiance pour acheter et vendre des produits.</p>
        </div>

        <div>
          <h4 className="footer-subtitle">Navigation</h4>
          <div className="footer-links">
            <Link to="/">Accueil</Link>
            <Link to="/products">Catalogue</Link>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </div>
        </div>

        <div>
          <h4 className="footer-subtitle">Contact</h4>
          <p className="footer-text">
            Une plateforme moderne pour connecter acheteurs et vendeurs.
          </p>
          <div className="footer-badges">
            <span>🛒 Achetez</span>
            <span>🏷️ Vendez</span>
            <span>🤝 Échangez</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SEM Market — Achetez, vendez, échangez en toute simplicité.</p>
      </div>
    </footer>
  );
}
