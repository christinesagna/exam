import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const linkStyle = ({ isActive }) => ({
  color: isActive ? "#2563eb" : "#111827",
  fontWeight: isActive ? 700 : 500,
  marginRight: 16,
});

function Navbar({ onMenuClick }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <div className="topbar-brand">
          {onMenuClick && (
            <button type="button" className="icon-button" onClick={onMenuClick}>
              ☰
            </button>
          )}
          <Link to="/" className="brand-link">
            EPF Marketplace
          </Link>
        </div>

        <nav className="topbar-nav">
          <NavLink to="/" style={linkStyle} end>
            Accueil
          </NavLink>
          <NavLink to="/products" style={linkStyle}>
            Catalogue
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" style={linkStyle}>
                Connexion
              </NavLink>
              <NavLink to="/register" style={linkStyle}>
                Inscription
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/profile" style={linkStyle}>
                Mon profil
              </NavLink>

              {user?.role === "buyer" && (
                <>
                  <NavLink to="/cart" style={linkStyle}>
                    Panier
                  </NavLink>
                  <NavLink to="/orders" style={linkStyle}>
                    Commandes
                  </NavLink>
                </>
              )}

              {user?.role === "seller" && (
                <>
                  <NavLink to="/seller" style={linkStyle}>
                    Dashboard vendeur
                  </NavLink>
                  <NavLink to="/seller/products" style={linkStyle}>
                    Mes produits
                  </NavLink>
                </>
              )}

              {user?.role === "admin" && (
                <NavLink to="/admin" style={linkStyle}>
                  Administration
                </NavLink>
              )}

              <span className="topbar-user-chip">
                {user?.name || "Utilisateur"} · {user?.role || "compte"}
              </span>
              <button type="button" className="outline-button" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
