import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faChartLine,
  faStar,
  faShoppingCart,
  faMoneyBillWave,
  faClipboardList,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";

import SellerShell from "../../components/seller/SellerShell";
import sellerService from "../../services/sellerService";

const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

const numberFmt = new Intl.NumberFormat("fr-FR");

const extractLabel = (entry) =>
  entry.month ?? entry.label ?? entry.name ?? entry.period ?? "—";

const extractValue = (entry) =>
  Number(entry.total ?? entry.amount ?? entry.value ?? entry.sales ?? entry.revenue ?? 0);

const STATUS_LABELS = {
  pending: "En attente",
  processing: "En cours",
  delivered: "Livré",
  cancelled: "Annulé",
  shipped: "Expédié",
  completed: "Complété",
  refunded: "Remboursé",
};

const STATUS_COLORS = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  delivered: "#10b981",
  cancelled: "#ef4444",
  shipped: "#8b5cf6",
  completed: "#10b981",
  refunded: "#6b7280",
};

// Palette d'accents pour les KPI cards
const KPI_ACCENTS = [
  "#5b3fd4",
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#0ea5e9",
  "#ec4899",
];

export default function SellerStatisticsPage() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await sellerService.getStatistics();
        setStatistics(data);
      } catch (error) {
        console.error("[SellerStatisticsPage] Erreur:", error);
        toast.error("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kpiCards = useMemo(() => {
    if (!statistics) return [];
    const k = statistics.kpis;

    const cards = [
      {
        label: "Chiffre d'affaires",
        value: money.format(k.totalRevenue),
        icon: faMoneyBillWave,
        sub: "Revenu total généré",
      },
      {
        label: "Commandes reçues",
        value: numberFmt.format(k.totalOrders),
        icon: faClipboardList,
        sub: "Total des commandes",
      },
      {
        label: "Commandes en attente",
        value: numberFmt.format(k.pendingOrders),
        icon: faHourglassHalf,
        sub: "À traiter",
      },
      {
        label: "Produits publiés",
        value: numberFmt.format(k.publishedProducts),
        icon: faBox,
        sub: "Produits actifs en ligne",
      },
      {
        label: "Panier moyen",
        value: money.format(k.averageOrderValue),
        icon: faShoppingCart,
        sub: "Valeur moyenne par commande",
      },
      {
        label: "Taux de conversion",
        value: `${numberFmt.format(k.conversionRate)} %`,
        icon: faChartLine,
        sub: "Visiteurs convertis en acheteurs",
      },
      {
        label: "Vues produits",
        value: numberFmt.format(k.totalViews),
        icon: faChartLine,
        sub: "Visites sur vos fiches produits",
      },
      {
        label: "Satisfaction client",
        value: k.customerSatisfaction > 0
          ? `${numberFmt.format(k.customerSatisfaction)} / 5`
          : "—",
        icon: faStar,
        sub: "Note moyenne des avis",
      },
    ].filter(Boolean);

    return cards;
  }, [statistics]);

  return (
    <SellerShell
      title="Statistiques vendeur"
      subtitle="Indicateurs de performance de votre boutique"
    >
      {loading ? (
        <div style={loadingStyle}>
          <div style={spinnerStyle} />
          <span>Chargement des statistiques…</span>
        </div>
      ) : (
        <>
          {/* KPI CARDS */}
          <div style={kpiGrid}>
            {kpiCards.map((card, i) => (
              <article key={card.label} style={{ ...kpiCard, borderTop: `3px solid ${KPI_ACCENTS[i % KPI_ACCENTS.length]}` }}>
                <div style={kpiIconWrap}>
                  <FontAwesomeIcon
                    icon={card.icon}
                    style={{ color: KPI_ACCENTS[i % KPI_ACCENTS.length], fontSize: 18 }}
                  />
                </div>
                <div style={kpiLabel}>{card.label}</div>
                <div style={kpiValue}>{card.value}</div>
                <div style={kpiSub}>{card.sub}</div>
              </article>
            ))}
          </div>

          {/* VENTES PAR MOIS + STATUTS */}
          <div style={grid2cols}>
            <section style={card}>
              <h2 style={sectionTitle}>📅 Ventes par mois</h2>
              {(statistics?.salesByMonth ?? []).length === 0 ? (
                <p style={muted}>Aucune donnée mensuelle disponible.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={th}>Période</th>
                      <th style={{ ...th, textAlign: "right" }}>Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.salesByMonth.map((entry, index) => (
                      <tr key={`${extractLabel(entry)}-${index}`}>
                        <td style={td}>{extractLabel(entry)}</td>
                        <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>
                          {money.format(extractValue(entry))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>
                <FontAwesomeIcon icon={faBox} style={{ marginRight: 8 }} />
                Commandes par statut
              </h2>
              {Object.keys(statistics?.ordersByStatus ?? {}).length === 0 ? (
                <p style={muted}>Aucune répartition par statut disponible.</p>
              ) : (
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {Object.entries(statistics.ordersByStatus).map(([key, value]) => (
                    <li key={key} style={statusRow}>
                      <span
                        style={{
                          ...statusDot,
                          background: STATUS_COLORS[key] ?? "#6b7280",
                        }}
                      />
                      <span style={{ flex: 1 }}>{STATUS_LABELS[key] ?? key}</span>
                      <strong>{value}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* TOP PRODUITS */}
          <section style={{ ...card, marginTop: 16 }}>
            <h2 style={sectionTitle}>🏆 Top produits</h2>
            {(statistics?.topProducts ?? []).length === 0 ? (
              <p style={muted}>Aucun top produit disponible.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Produit</th>
                    <th style={{ ...th, textAlign: "right" }}>Ventes</th>
                    <th style={{ ...th, textAlign: "right" }}>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.topProducts.map((product, index) => (
                    <tr key={product.id ?? index}>
                      <td style={{ ...td, color: "#6b7280", width: 32 }}>{index + 1}</td>
                      <td style={td}>{product.name ?? product.title ?? "Produit"}</td>
                      <td style={{ ...td, textAlign: "right" }}>
                        {product.sales_count ?? product.quantity ?? product.total_sold ?? 0}
                      </td>
                      <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>
                        {money.format(
                          Number(product.total ?? product.amount ?? product.revenue ?? 0)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </SellerShell>
  );
}

/* ── Styles ── */

const loadingStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 40,
  color: "#6b7280",
};

const spinnerStyle = {
  width: 24,
  height: 24,
  border: "3px solid #e5e7eb",
  borderTop: "3px solid #5b3fd4",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
  marginBottom: 24,
};

const kpiCard = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: "18px 20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const kpiIconWrap = {
  marginBottom: 10,
};

const kpiLabel = {
  fontSize: 13,
  color: "#6b7280",
  fontWeight: 500,
  marginBottom: 4,
};

const kpiValue = {
  fontSize: 26,
  fontWeight: 700,
  color: "#111827",
  lineHeight: 1.2,
};

const kpiSub = {
  fontSize: 12,
  color: "#9ca3af",
  marginTop: 4,
};

const grid2cols = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
  alignItems: "start",
};

const card = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 18,
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: 14,
  fontSize: 16,
  fontWeight: 600,
};

const muted = { color: "#9ca3af", fontSize: 14 };

const th = {
  textAlign: "left",
  padding: "10px 0",
  borderBottom: "1px solid #e5e7eb",
  color: "#6b7280",
  fontSize: 13,
};

const td = {
  padding: "12px 0",
  borderBottom: "1px solid #f3f4f6",
};

const statusRow = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 0",
  borderBottom: "1px solid #f3f4f6",
};

const statusDot = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  flexShrink: 0,
};