import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";
import semLogo from "../../assets/SEM-Market.png";

const linkStyle = ({ isActive }) => ({
  textDecoration: "none",
  color: isActive ? "#16a34a" : "#1e293b",
  fontWeight: isActive ? 700 : 500,
  fontSize: "0.95rem",
  padding: "6px 10px",
  borderRadius: "8px",
  background: isActive ? "#f0fdf4" : "transparent",
  transition: "all 0.15s",
});

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <img src={semLogo} alt="SEM Market" className="navbar-logo" />
          <span className="navbar-brand-name">SEM <span>Market</span></span>
        </Link>

        {/* Nav links */}
        <nav className="navbar-links">
          <NavLink to="/products" style={linkStyle}>Catalogue</NavLink>
          <NavLink to="/search?q=" style={linkStyle}>Recherche</NavLink>
        </nav>

        {/* Auth zone */}
        <div className="navbar-auth">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className="navbar-link-plain">Connexion</NavLink>
              <Link to="/register" className="navbar-cta">S'inscrire</Link>
            </>
          ) : (
            <>
              <span className="navbar-user-chip">
                {user?.name || user?.email || "Utilisateur"}
              </span>
              <NavLink to="/profile" style={linkStyle}>Profil</NavLink>
              {user?.role === "buyer" && <NavLink to="/cart" style={linkStyle}><FontAwesomeIcon icon={faShoppingCart} /> Panier</NavLink>}
              {user?.role === "seller" && <NavLink to="/seller" style={linkStyle}>Espace vendeur</NavLink>}
              {user?.role === "admin" && <NavLink to="/admin" style={linkStyle}>Admin</NavLink>}
              <button type="button" onClick={handleLogout} className="navbar-logout">
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
