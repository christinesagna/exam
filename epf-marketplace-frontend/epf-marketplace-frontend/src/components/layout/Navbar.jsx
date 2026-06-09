import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/">Accueil</Link>
        <Link to="/products">Catalogue</Link>
      </div>

      <div>
        {!isAuthenticated ? (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Mon profil</Link>

            {user?.role === "buyer" && <Link to="/cart">Panier</Link>}
            {user?.role === "buyer" && <Link to="/orders">Mes commandes</Link>}

            {user?.role === "seller" && <Link to="/seller">Dashboard vendeur</Link>}
            {user?.role === "seller" && <Link to="/seller/products">Mes produits</Link>}

            {user?.role === "admin" && <Link to="/admin">Administration</Link>}

            <button onClick={handleLogout}>Déconnexion</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
