import { useEffect, useMemo, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import SellerMetricCard from "../../components/seller/SellerMetricCard";
import SellerWorkspaceTabs from "../../components/seller/SellerWorkspaceTabs";
import { sellerService } from "../../services/sellerService";

const periods = [
  { value: "week", label: "7 jours" },
  { value: "month", label: "30 jours" },
  { value: "year", label: "12 mois" },
];

function currency(value) {
  const numeric = Number.parseFloat(value || 0);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number.isNaN(numeric) ? 0 : numeric);
}

export default function SellerStatisticsPage() {
  const [period, setPeriod] = useState("month");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadStats() {
      try {
        setLoading(true);
        setError("");
        const data = await sellerService.getStatistics(period);
        if (!ignore) {
          setStats(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.response?.data?.message || "Impossible de charger les statistiques vendeur.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadStats();
    return () => {
      ignore = true;
    };
  }, [period]);

  const cards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "Vues produits",
        value: stats.total_views ?? 0,
        hint: "Somme des vues sur vos produits",
        accent: "#2563eb",
      },
      {
        title: "Clics estimés",
        value: stats.total_clicks ?? 0,
        hint: "10% des vues selon le backend",
        accent: "#0f766e",
      },
      {
        title: "Taux de conversion",
        value: `${stats.conversion_rate ?? 0}%`,
        hint: "Commandes / vues sur la période",
        accent: "#d97706",
      },
      {
        title: "Panier moyen",
        value: currency(stats.average_order_value),
        hint: "Montant moyen par commande",
        accent: "#7c3aed",
      },
      {
        title: "Satisfaction client",
        value: stats.customer_satisfaction ?? 0,
        hint: "Note moyenne du vendeur",
        accent: "#db2777",
      },
      {
        title: "Croissance",
        value: `${stats.growth_rate ?? 0}%`,
        hint: "Champ backend prêt pour évolution",
        accent: "#16a34a",
      },
    ];
  }, [stats]);

  return (
    <section>
      <p style={{ margin: 0, color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
        Sprint 4 · Seller statistics
      </p>
      <h1 style={{ margin: "8px 0 12px", fontSize: 32, color: "#0f172a" }}>Statistiques vendeur</h1>
      <p style={{ margin: "0 0 24px", color: "#475569", maxWidth: 860, lineHeight: 1.6 }}>
        Vue analytique branchée sur <code>GET /api/seller/statistics</code> avec filtre de période
        <code> week | month | year</code> pour piloter la performance commerciale.
      </p>

      <SellerWorkspaceTabs />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        {periods.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setPeriod(item.value)}
            style={{
              border: `1px solid ${period === item.value ? "#2563eb" : "#cbd5e1"}`,
              background: period === item.value ? "#dbeafe" : "#ffffff",
              color: period === item.value ? "#1d4ed8" : "#334155",
              borderRadius: 10,
              padding: "10px 14px",
              fontWeight: 700,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading && <Loader />}
      {!loading && error && <ErrorMessage message={error} />}

      {!loading && !error && stats && (
        <div style={{ display: "grid", gap: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {cards.map((card) => (
              <SellerMetricCard key={card.title} {...card} />
            ))}
          </div>

          <article style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24 }}>
            <h2 style={{ marginTop: 0, color: "#0f172a" }}>Lecture métier</h2>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#475569", lineHeight: 1.9 }}>
              <li>Un fort volume de vues avec une conversion basse suggère de retravailler prix, photos ou fiches produits.</li>
              <li>Le panier moyen aide à piloter les bundles, ventes flash et seuils promotionnels.</li>
              <li>La satisfaction client doit rester stable avant d'augmenter le volume expédié.</li>
              <li>Le champ <code>growth_rate</code> est déjà exposé par l'API, ce qui facilite un futur graphique comparatif.</li>
            </ul>
          </article>
        </div>
      )}
    </section>
  );
}
