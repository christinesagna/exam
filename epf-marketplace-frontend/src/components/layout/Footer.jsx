import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-title">EPF Marketplace</h3>
          <p className="footer-text">
            Votre destination de confiance pour acheter et vendre des produits.
          </p>
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
          <h4 className="footer-subtitle">Socle technique</h4>
          <p className="footer-text">
            
          </p>
        </div>
      </div>
    </footer>
  );
}
