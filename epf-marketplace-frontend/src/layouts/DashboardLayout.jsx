import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";

const topbarLinkStyle = ({ isActive }) => ({
  textDecoration: "none",
  color: isActive ? "#166534" : "#334155",
  background: isActive ? "#dcfce7" : "#ffffff",
  border: "1px solid #d1fae5",
  padding: "10px 14px",
  borderRadius: 10,
  fontWeight: 700,
});

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        <header className="topbar">
          <div className="topbar-inner" style={{ padding: "14px 24px" }}>
            <div className="topbar-brand">
              <button
                type="button"
                className="icon-button mobile-only"
                onClick={() => setSidebarOpen(true)}
                aria-label="Ouvrir le menu admin"
              >
                ☰
              </button>

              <div />
            </div>

            <nav className="topbar-nav">
              <NavLink to="/admin" end style={topbarLinkStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/users" style={topbarLinkStyle}>
                Utilisateurs
              </NavLink>
              <NavLink to="/admin/products" style={topbarLinkStyle}>
                Produits
              </NavLink>
              <NavLink to="/admin/coupons" style={topbarLinkStyle}>
                Coupons
              </NavLink>
              <NavLink to="/" style={topbarLinkStyle}>
                Retour au site
              </NavLink>

            </nav>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
