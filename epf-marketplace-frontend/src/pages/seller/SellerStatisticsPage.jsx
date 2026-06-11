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

const extractLabel = (entry) =>
  entry.month ??
  entry.label ??
  entry.name ??
  entry.period ??
  "—";

const extractValue = (entry) =>
  Number(
    entry.total ??
      entry.amount ??
      entry.value ??
      entry.sales ??
      0
  );

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
        toast.error("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  const cards = useMemo(() => {
    if (!statistics) return [];

    const topProductsCount = statistics.topProducts?.length ?? 0;
    const statusCount = Object.keys(statistics.ordersByStatus ?? {}).length;
    const monthlyPoints = statistics.salesByMonth?.length ?? 0;

    return [
      { label: "Top produits", value: topProductsCount },
      { label: "Statuts suivis", value: statusCount },
      { label: "Périodes de ventes", value: monthlyPoints },
    ];
  }, [statistics]);

  return (
    <SellerShell
      title="Statistiques vendeur"
      subtitle="Synthèse des ventes, statuts de commandes et meilleurs produits"
    >
      {loading ? (
        <div>Chargement des statistiques...</div>
      ) : (
        <>
          <SellerStatsCards cards={cards} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              alignItems: "start",
            }}
          >
            <section style={card}>
              <h2 style={sectionTitle}>Ventes par mois</h2>

              {(statistics?.salesByMonth ?? []).length === 0 ? (
                <p style={muted}>Aucune donnée mensuelle</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={th}>Période</th>
                      <th style={th}>Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.salesByMonth.map((entry, index) => (
                      <tr key={`${extractLabel(entry)}-${index}`}>
                        <td style={td}>{extractLabel(entry)}</td>
                        <td style={td}>{money.format(extractValue(entry))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>Commandes par statut</h2>

              {Object.keys(statistics?.ordersByStatus ?? {}).length === 0 ? (
                <p style={muted}>Aucune répartition disponible</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {Object.entries(statistics.ordersByStatus).map(([key, value]) => (
                    <li key={key} style={{ marginBottom: 10 }}>
                      <strong>{key}</strong> : {value}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section style={{ ...card, marginTop: 16 }}>
            <h2 style={sectionTitle}>Top produits</h2>

            {(statistics?.topProducts ?? []).length === 0 ? (
              <p style={muted}>Aucun top produit disponible</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Produit</th>
                    <th style={th}>Ventes</th>
                    <th style={th}>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.topProducts.map((product, index) => (
                    <tr key={product.id ?? index}>
                      <td style={td}>{product.name ?? product.title ?? "Produit"}</td>
                      <td style={td}>{product.sales_count ?? product.quantity ?? 0}</td>
                      <td style={td}>
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

const card = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 18,
};

const sectionTitle = {
  marginTop: 0,
};

const muted = {
  color: "#6b7280",
};

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
