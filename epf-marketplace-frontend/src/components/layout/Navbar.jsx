import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">EPF Marketplace</Link>
        <Link to="/products">Produits</Link>
      </div>

      <div className="navbar-right">
        {!isAuthenticated ? (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Profil</Link>

            {user?.role === 'buyer' && <Link to="/cart">Panier</Link>}
            {user?.role === 'buyer' && <Link to="/orders">Mes commandes</Link>}

            {user?.role === 'seller' && <Link to="/seller">Espace vendeur</Link>}
            {user?.role === 'admin' && <Link to="/admin">Admin</Link>}

            <button onClick={logout}>Déconnexion</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
