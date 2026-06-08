import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const linkStyle = ({ isActive }) => ({
  textDecoration: "none",
  color: isActive ? "#2563eb" : "#334155",
  fontWeight: isActive ? 700 : 500,
});

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#0f172a", fontWeight: 800 }}>
            EPF Marketplace
          </Link>
          <NavLink to="/products" style={linkStyle}>
            Catalogue
          </NavLink>
          <NavLink to="/search?q=" style={linkStyle}>
            Recherche
          </NavLink>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
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
              <span style={{ color: "#64748b", fontSize: 14 }}>
                {user?.name || user?.email || "Utilisateur"}
              </span>
              <NavLink to="/profile" style={linkStyle}>
                Profil
              </NavLink>
              {user?.role === "buyer" && <NavLink to="/cart" style={linkStyle}>Panier</NavLink>}
              {user?.role === "seller" && <NavLink to="/seller" style={linkStyle}>Espace vendeur</NavLink>}
              {user?.role === "admin" && <NavLink to="/admin" style={linkStyle}>Admin</NavLink>}
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  border: "none",
                  background: "#0f172a",
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
