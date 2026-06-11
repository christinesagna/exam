import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/seller", label: "Dashboard" },
  { to: "/seller/statistics", label: "Statistiques" },
  { to: "/seller/orders", label: "Commandes" },
  { to: "/seller/products", label: "Mes produits" },
];

export default function SellerWorkspaceTabs() {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 24,
      }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/seller"}
          style={({ isActive }) => ({
            textDecoration: "none",
            padding: "10px 14px",
            borderRadius: 999,
            border: `1px solid ${isActive ? "#2563eb" : "#cbd5e1"}`,
            background: isActive ? "#dbeafe" : "#ffffff",
            color: isActive ? "#1d4ed8" : "#334155",
            fontWeight: 600,
            fontSize: 14,
          })}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
