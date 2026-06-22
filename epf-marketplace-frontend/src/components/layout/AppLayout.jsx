import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faCommentDots, faStore, faCog } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

const linkStyle = ({ isActive }) => ({
  textDecoration: "none",
  color: isActive ? "#111827" : "#4b5563",
  fontWeight: isActive ? 700 : 500,
});

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const isBuyer = user?.role === "buyer";
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#111827",
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            EPF Marketplace
          </Link>

          <nav style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <NavLink to="/" style={linkStyle}>Accueil</NavLink>
            <NavLink to="/products" style={linkStyle}>Catalogue</NavLink>

            {/* Liens acheteur */}
            {isBuyer && (
              <>
                <NavLink to="/favorites" style={linkStyle}>Favoris</NavLink>
                <NavLink to="/orders" style={linkStyle}>Mes commandes</NavLink>
                <NavLink to="/cart" style={linkStyle}>
                  <FontAwesomeIcon icon={faShoppingCart} /> Panier {itemCount > 0 ? `(${itemCount})` : ""}
                </NavLink>
              </>
            )}

            {/* Messages : visible pour les acheteurs et vendeurs, pas pour les admins */}
            {isAuthenticated && !isAdmin && (
              <NavLink to="/messages" style={linkStyle}><FontAwesomeIcon icon={faCommentDots} /> Messages</NavLink>
            )}

            {/* Liens vendeur */}
            {isSeller && (
              <NavLink to="/seller" style={linkStyle}><FontAwesomeIcon icon={faStore} /> Espace vendeur</NavLink>
            )}

            {/* Liens admin */}
            {isAdmin && (
              <NavLink to="/admin" style={linkStyle}><FontAwesomeIcon icon={faCog} /> Admin</NavLink>
            )}
          </nav>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            {isAuthenticated ? (
              <>
                <span style={{
                  fontSize: 13,
                  color: "#4b5563",
                  background: "#f3f4f6",
                  padding: "4px 10px",
                  borderRadius: 20,
                }}>
                  {user?.name || user?.email}{" "}
                  <span style={{ color: "#2563eb", fontWeight: 600 }}>
                    ({user?.role})
                  </span>
                </span>
                <NavLink to="/profile" style={linkStyle}>Profil</NavLink>
                <button
                  onClick={handleLogout}
                  style={{
                    border: "none",
                    background: "#111827",
                    color: "#fff",
                    padding: "10px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" style={linkStyle}>Connexion</NavLink>
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    background: "#2563eb",
                    color: "#fff",
                    padding: "10px 14px",
                    borderRadius: 10,
                    fontWeight: 600,
                  }}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        <Outlet />
      </main>
    </div>
  );
}
