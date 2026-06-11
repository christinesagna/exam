import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px 14px",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 600,
  marginBottom: 8,
  color: isActive ? "#fff" : "#1f2937",
  background: isActive ? "#111827" : "#f3f4f6",
});

export default function SellerShell({ title, subtitle, actions, children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: 24,
        padding: 24,
      }}
    >
      <aside>
        <h2 style={{ marginTop: 0 }}>Espace vendeur</h2>

        <nav>
          <NavLink to="/seller" end style={linkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/seller/products" style={linkStyle}>
            Mes produits
          </NavLink>
          <NavLink to="/seller/orders" style={linkStyle}>
            Commandes
          </NavLink>
          <NavLink to="/seller/statistics" style={linkStyle}>
            Statistiques
          </NavLink>
          <NavLink to="/messages" style={linkStyle}>
            Messagerie
          </NavLink>
        </nav>
      </aside>

      <section>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>{title}</h1>
            {subtitle ? (
              <p style={{ marginTop: 6, color: "#6b7280" }}>{subtitle}</p>
            ) : null}
          </div>

          <div>{actions}</div>
        </header>

        {children}
      </section>
    </div>
  );
}
