import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import SellerMetricCard from "../../components/seller/SellerMetricCard";
import SellerStatusBadge from "../../components/seller/SellerStatusBadge";
import SellerWorkspaceTabs from "../../components/seller/SellerWorkspaceTabs";
import { sellerService } from "../../services/sellerService";

function currency(value) {
  const numeric = Number.parseFloat(value || 0);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number.isNaN(numeric) ? 0 : numeric);
}

function dateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("fr-FR");
}

export default function SellerDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");
        const data = await sellerService.getDashboard();
        if (!ignore) {
          setDashboard(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.response?.data?.message || "Impossible de charger le dashboard vendeur.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      ignore = true;
    };
  }, []);

  const metrics = useMemo(() => {
    if (!dashboard) return [];

    return [
      {
        title: "Chiffre d'affaires",
        value: currency(dashboard.total_sales),
        hint: "Somme des ventes liées aux commandes actives",
        accent: "#2563eb",
      },
      {
        title: "Commandes reçues",
        value: dashboard.total_orders ?? 0,
        hint: "Nombre total de commandes contenant vos articles",
        accent: "#0f766e",
      },
      {
        title: "Commandes en attente",
        value: dashboard.pending_orders ?? 0,
        hint: "À confirmer ou à traiter rapidement",
        accent: "#d97706",
      },
      {
        title: "Produits créés",
        value: dashboard.total_products ?? 0,
        hint: "Stock vendeur total",
        accent: "#7c3aed",
      },
      {
        title: "Produits publiés",
        value: dashboard.active_products ?? 0,
        hint: "Disponibles à l'achat",
        accent: "#16a34a",
      },
      {
        title: "Note moyenne",
        value: dashboard.average_rating ?? 0,
        hint: "Satisfaction vendeur",
        accent: "#db2777",
      },
    ];
  }, [dashboard]);

  return (
    <section>
      <p style={{ margin: 0, color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
        Sprint 4 · Lot L10
      </p>
      <h1 style={{ margin: "8px 0 12px", fontSize: 32, color: "#0f172a" }}>Seller dashboard</h1>
      <p style={{ margin: "0 0 24px", color: "#475569", maxWidth: 900, lineHeight: 1.6 }}>
        Ce tableau de bord couvre le lot vendeur du sprint 4 : visualisation des KPI,
        lecture des commandes reçues et accès rapide aux statistiques et à l'espace produit.
      </p>

      <SellerWorkspaceTabs />

      {loading && <Loader />}
      {!loading && error && <ErrorMessage message={error} />}

      {!loading && !error && dashboard && (
        <div style={{ display: "grid", gap: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {metrics.map((metric) => (
              <SellerMetricCard key={metric.title} {...metric} />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
            <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <h2 style={{ margin: 0, color: "#0f172a" }}>Commandes récentes</h2>
                <Link to="/seller/orders" style={{ color: "#2563eb", fontWeight: 700 }}>
                  Voir tout
                </Link>
              </div>

              {dashboard.recent_orders?.length ? (
                <div style={{ display: "grid", gap: 12 }}>
                  {dashboard.recent_orders.map((order) => (
                    <div
                      key={order.order_number}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                        padding: "14px 16px",
                        background: "#f8fafc",
                        borderRadius: 12,
                      }}
                    >
                      <div>
                        <strong style={{ color: "#0f172a" }}>{order.order_number}</strong>
                        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 14 }}>
                          Créée le {dateTime(order.created_at)}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, color: "#0f172a" }}>{currency(order.total)}</span>
                        <SellerStatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, color: "#64748b" }}>Aucune commande récente.</p>
              )}
            </article>

            <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
              <h2 style={{ marginTop: 0, color: "#0f172a" }}>Top produits</h2>
              {dashboard.top_products?.length ? (
                <div style={{ display: "grid", gap: 12 }}>
                  {dashboard.top_products.map((product) => (
                    <div key={product.title} style={{ padding: "12px 14px", borderRadius: 12, background: "#f8fafc" }}>
                      <strong style={{ color: "#0f172a" }}>{product.title}</strong>
                      <p style={{ margin: "8px 0 4px", color: "#475569", fontSize: 14 }}>
                        Ventes : {product.sales_count}
                      </p>
                      <p style={{ margin: 0, color: "#2563eb", fontWeight: 700 }}>
                        Revenu estimé : {currency(product.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, color: "#64748b" }}>Aucune donnée produit disponible.</p>
              )}
            </article>
          </div>

          <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <h2 style={{ margin: 0, color: "#0f172a" }}>Ventes mensuelles</h2>
              <Link to="/seller/statistics" style={{ color: "#2563eb", fontWeight: 700 }}>
                Ouvrir les statistiques
              </Link>
            </div>

            {dashboard.monthly_sales?.length ? (
              <div style={{ display: "grid", gap: 12 }}>
                {dashboard.monthly_sales.map((row) => (
                  <div
                    key={row.month}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px 1fr 140px",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <strong style={{ color: "#334155" }}>{row.month}</strong>
                    <div style={{ height: 12, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${Math.min((Number(row.amount || 0) / Math.max(...dashboard.monthly_sales.map((item) => Number(item.amount || 0)), 1)) * 100, 100)}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, #2563eb, #0ea5e9)",
                        }}
                      />
                    </div>
                    <span style={{ color: "#0f172a", fontWeight: 700 }}>{currency(row.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, color: "#64748b" }}>Aucune vente consolidée pour l'instant.</p>
            )}
          </article>
        </div>
      )}
    </section>
  );
}
