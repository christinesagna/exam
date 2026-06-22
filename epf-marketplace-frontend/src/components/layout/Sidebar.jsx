import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faChartLine,
  faUsers,
  faBoxOpen,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";

const DEFAULT_NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: faChartLine, end: true },
  { to: "/admin/users", label: "Utilisateurs", icon: faUsers, end: false },
  { to: "/admin/products", label: "Produits", icon: faBoxOpen, end: false },
  { to: "/admin/coupons", label: "Coupons", icon: faTags, end: false },
];

export default function Sidebar({
  isOpen = true,
  onClose,
  items = DEFAULT_NAV_ITEMS,
  title = "Administration",
}) {
  const { user } = useAuth();

  return (
    <>
      {isOpen ? <div className="sidebar-overlay" onClick={onClose} /> : null}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div>
            <span className="sidebar-brand">{title}</span>
            
          </div>

          <button
            type="button"
            onClick={onClose}
            className="icon-button mobile-only"
            aria-label="Fermer le menu admin"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              <span aria-hidden="true">
                <FontAwesomeIcon icon={item.icon} />
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <strong>{user?.name || "Administrateur"}</strong>
          <span>{user?.email || "admin@example.com"}</span>
          <span style={{ color: "#166534", fontWeight: 700, marginTop: 4 }}>
            Rôle : {user?.role || "admin"}
          </span>
        </div>
      </aside>
    </>
  );
}
