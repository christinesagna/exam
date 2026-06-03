import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard",  label: "Dashboard",  icon: "📊" },
  { to: "/products",   label: "Produits",   icon: "📦" },
  { to: "/orders",     label: "Commandes",  icon: "🛒" },
  { to: "/users",      label: "Utilisateurs", icon: "👥" },
  { to: "/settings",   label: "Paramètres", icon: "⚙️" },
];

export default function Sidebar({ isOpen = true, onClose }) {
  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200
        z-30 flex flex-col transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-xl font-bold text-blue-600">MonShop</span>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer sidebar — profil utilisateur */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">Utilisateur</p>
              <p className="text-xs text-gray-400 truncate">user@mail.com</p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}