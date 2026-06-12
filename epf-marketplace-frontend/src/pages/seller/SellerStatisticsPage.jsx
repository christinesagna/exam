import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import SellerShell from "../../components/seller/SellerShell";
import SellerStatsCards from "../../components/seller/SellerStatsCards";
import sellerService from "../../services/sellerService";

const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("fr-FR");

const extractLabel = (entry) =>
  entry.month ?? entry.label ?? entry.name ?? entry.period ?? "—";

const extractValue = (entry) =>
  Number(entry.total ?? entry.amount ?? entry.value ?? entry.sales ?? entry.revenue ?? 0);

const formatPercentage = (value) => `${numberFormatter.format(value)} %`;
const formatSatisfaction = (value) => `${numberFormatter.format(value)} / 5`;

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

export default function SellerStatisticsPage() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatistics = async () => {
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
    };

    loadStatistics();
  }, []);

  const cards = useMemo(() => {
    if (!statistics) return [];

    return [
      {
        label: "Vues totales",
        value: numberFormatter.format(statistics.kpis?.totalViews ?? 0),
        help: "Nombre réel renvoyé par l'API",
      },
      {
        label: "Clics totaux",
        value: numberFormatter.format(statistics.kpis?.totalClicks ?? 0),
        help: "Nombre réel renvoyé par l'API",
      },
      {
        label: "Taux de conversion",
        value: formatPercentage(statistics.kpis?.conversionRate ?? 0),
        help: "Valeur réelle renvoyée par l'API",
      },
      {
        label: "Panier moyen",
        value: money.format(statistics.kpis?.averageOrderValue ?? 0),
        help: "Valeur réelle renvoyée par l'API",
      },
      {
        label: "Satisfaction client",
        value: formatSatisfaction(statistics.kpis?.customerSatisfaction ?? 0),
        help: "Note réelle renvoyée par l'API",
      },
      {
        label: "Croissance",
        value: formatPercentage(statistics.kpis?.growthRate ?? 0),
        help: "Valeur réelle renvoyée par l'API",
      },
    ];
  }, [statistics]);

  const hasDetailedBreakdown =
    statistics &&
    ((statistics.salesByMonth?.length ?? 0) > 0 ||
      Object.keys(statistics.ordersByStatus ?? {}).length > 0 ||
      (statistics.topProducts?.length ?? 0) > 0);

  return (
    <SellerShell
      title="Statistiques vendeur"
      subtitle="Indicateurs réels fournis par l'API vendeur"
    >
      {loading ? (
        <div style={loadingStyle}>
          <div style={spinner} />
          <span>Chargement des statistiques…</span>
        </div>
      ) : (
        <>
          <SellerStatsCards cards={cards} />

          {!hasDetailedBreakdown && (
            <div style={infoBanner}>
              <span style={{ fontSize: 20 }}>ℹ️</span>
              <div>
                <strong>Détails avancés non fournis par l'API</strong>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
                  L'endpoint <code>/seller/statistics</code> renvoie bien les KPI globaux
                  (vues, clics, conversion, panier moyen, satisfaction, croissance),
                  mais il ne fournit pas encore de données mensuelles, de répartition par
                  statut ou de top produits dans la réponse actuelle.
                </p>
              </div>
            </div>
          )}

          <div style={grid2cols}>
            <section style={card}>
              <h2 style={sectionTitle}>📅 Ventes par mois</h2>
              {(statistics?.salesByMonth ?? []).length === 0 ? (
                <p style={muted}>Aucune donnée mensuelle renvoyée par l'API.</p>
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
              <h2 style={sectionTitle}>📦 Commandes par statut</h2>
              {Object.keys(statistics?.ordersByStatus ?? {}).length === 0 ? (
                <p style={muted}>Aucune répartition par statut renvoyée par l'API.</p>
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

          <section style={{ ...card, marginTop: 16 }}>
            <h2 style={sectionTitle}>🏆 Top produits</h2>
            {(statistics?.topProducts ?? []).length === 0 ? (
              <p style={muted}>Aucun top produit renvoyé par l'API.</p>
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

const loadingStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 40,
  color: "#6b7280",
};

const spinner = {
  width: 24,
  height: 24,
  border: "3px solid #e5e7eb",
  borderTop: "3px solid #111827",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const infoBanner = {
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: 10,
  padding: "14px 18px",
  marginBottom: 16,
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

const muted = { color: "#6b7280" };

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
