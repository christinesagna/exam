import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "📊" },
  { to: "/admin/products", label: "Produits", icon: "📦" },
  { to: "/admin/orders", label: "Commandes", icon: "🛒" },
  { to: "/admin/users", label: "Utilisateurs", icon: "👥" },
];

export default function Sidebar({ isOpen = true, onClose }) {
  const { user } = useAuth();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-brand">Admin EPF</span>
          <button type="button" onClick={onClose} className="icon-button mobile-only">
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <strong>{user?.name || "Administrateur"}</strong>
          <span>{user?.email || "admin@example.com"}</span>
        </div>
      </aside>
    </>
  );
}
