import { Link } from "react-router-dom";

const LINKS = {
  "Boutique":    [{ label: "Catalogue",    to: "/products" },
                  { label: "Promotions",   to: "/promo" },
                  { label: "Nouveautés",   to: "/new" }],
  "Aide":        [{ label: "FAQ",          to: "/faq" },
                  { label: "Contact",      to: "/contact" },
                  { label: "Livraison",    to: "/shipping" }],
  "Légal":       [{ label: "CGV",          to: "/cgv" },
                  { label: "Confidentialité", to: "/privacy" },
                  { label: "Mentions légales", to: "/legal" }],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* Branding */}
        <div className="col-span-2 md:col-span-1">
          <span className="text-white text-xl font-bold">MonShop</span>
          <p className="mt-3 text-sm leading-relaxed">
            Votre boutique en ligne de confiance. Livraison rapide, retours faciles.
          </p>
        </div>

        {/* Liens */}
        {Object.entries(LINKS).map(([section, items]) => (
          <div key={section}>
            <h3 className="text-white text-sm font-semibold mb-3">{section}</h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm hover:text-white transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bas de footer */}
      <div className="border-t border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} MonShop. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>🔒 Paiement sécurisé</span>
            <span>🚚 Livraison 48h</span>
            <span>↩️ Retour 30 jours</span>
          </div>
        </div>
      </div>

    </footer>
  );
}