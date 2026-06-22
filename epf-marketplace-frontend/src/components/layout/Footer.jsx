import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHome, faSearch, faCommentDots, faUser, faBox, faHeart, faChartLine, faClipboard, faKey, faStar, faMapMarkerAlt, faEnvelope, faPhone, faLock } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";

export default function Footer() {
  const { isAuthenticated, user } = useAuth();
  const isBuyer = user?.role === "buyer";
  const isSeller = user?.role === "seller";

  return (
    <footer className="epf-footer">
      <div className="epf-footer-inner">
        {/* Colonne brand */}
        <div className="epf-footer-brand">
          <div className="epf-footer-logo-wrap">
            <div className="epf-footer-logo-icon">EPF</div>
            <div>
              <div className="epf-footer-logo-name">EPF MARKETPLACE</div>
              <div className="epf-footer-logo-tagline">La marketplace de confiance</div>
            </div>
          </div>
          <p className="epf-footer-desc">
            Achetez, vendez et échangez des produits de qualité en toute sécurité. 
            La plateforme qui connecte acheteurs et vendeurs partout en Afrique.
          </p>
          <div className="epf-footer-badges">
            <span><FontAwesomeIcon icon={faShoppingCart} /> Achetez</span>
            <span><FontAwesomeIcon icon={faShoppingCart} /> Vendez</span>
            <span><FontAwesomeIcon icon={faUser} /> Échangez</span>
            <span><FontAwesomeIcon icon={faLock} /> Sécurisé</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="epf-footer-col">
          <h4 className="epf-footer-heading">Navigation</h4>
          <div className="epf-footer-links">
            <Link to="/"><FontAwesomeIcon icon={faHome} /> Accueil</Link>
            <Link to="/products"><FontAwesomeIcon icon={faShoppingCart} /> Catalogue</Link>
            <Link to="/search?q="><FontAwesomeIcon icon={faSearch} /> Recherche</Link>
            {isAuthenticated && <Link to="/messages"><FontAwesomeIcon icon={faCommentDots} /> Messages</Link>}
            {isAuthenticated && <Link to="/profile"><FontAwesomeIcon icon={faUser} /> Mon profil</Link>}
          </div>
        </div>

        {/* Selon rôle */}
        {isBuyer && (
          <div className="epf-footer-col">
            <h4 className="epf-footer-heading">Mon espace</h4>
            <div className="epf-footer-links">
              <Link to="/cart"><FontAwesomeIcon icon={faShoppingCart} /> Mon panier</Link>
              <Link to="/orders"><FontAwesomeIcon icon={faBox} /> Mes commandes</Link>
              <Link to="/favorites"><FontAwesomeIcon icon={faHeart} /> Favoris</Link>
            </div>
          </div>
        )}

        {isSeller && (
          <div className="epf-footer-col">
            <h4 className="epf-footer-heading">Espace vendeur</h4>
            <div className="epf-footer-links">
              <Link to="/seller"><FontAwesomeIcon icon={faChartLine} /> Dashboard</Link>
              <Link to="/seller/products"><FontAwesomeIcon icon={faClipboard} /> Mes produits</Link>
              <Link to="/seller/orders"><FontAwesomeIcon icon={faBox} /> Commandes</Link>
              <Link to="/seller/statistics"><FontAwesomeIcon icon={faChartLine} /> Statistiques</Link>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="epf-footer-col">
            <h4 className="epf-footer-heading">Rejoignez-nous</h4>
            <div className="epf-footer-links">
              <Link to="/login"><FontAwesomeIcon icon={faKey} /> Se connecter</Link>
              <Link to="/register"><FontAwesomeIcon icon={faStar} /> Créer un compte</Link>
            </div>
            <p className="epf-footer-join-text">
              Rejoignez des milliers d'acheteurs et vendeurs sur notre plateforme.
            </p>
          </div>
        )}

        {/* Contact */}
        <div className="epf-footer-col">
          <h4 className="epf-footer-heading">Contact</h4>
          <div className="epf-footer-contact-list">
            <div className="epf-footer-contact-item">
              <span><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
              <span>Dakar, Sénégal</span>
            </div>
            <div className="epf-footer-contact-item">
              <span><FontAwesomeIcon icon={faEnvelope} /></span>
              <span>contact@epf-marketplace.sn</span>
            </div>
            <div className="epf-footer-contact-item">
              <span><FontAwesomeIcon icon={faPhone} /></span>
              <span>+221 33 000 00 00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="epf-footer-bottom">
        <p>© {new Date().getFullYear()} EPF Marketplace — Tous droits réservés.</p>
        <div className="epf-footer-bottom-links">
          <a href="#">Conditions d'utilisation</a>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Aide</a>
        </div>
      </div>
    </footer>
  );
}