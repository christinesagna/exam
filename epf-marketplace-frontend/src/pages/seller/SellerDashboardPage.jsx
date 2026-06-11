import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import SellerShell from "../../components/seller/SellerShell";
import SellerStatsCards from "../../components/seller/SellerStatsCards";
import SellerOrdersTable from "../../components/seller/SellerOrdersTable";
import sellerService from "../../services/sellerService";

const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

export default function SellerDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await sellerService.getDashboard();
        setDashboard(data);
      } catch (error) {
        toast.error("Impossible de charger le dashboard vendeur");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const cards = useMemo(() => {
    if (!dashboard) return [];

    return [
      {
        label: "Chiffre d'affaires",
        value: money.format(dashboard.revenue || 0),
      },
      {
        label: "Commandes",
        value: dashboard.ordersCount || 0,
      },
      {
        label: "En attente",
        value: dashboard.pendingOrders || 0,
      },
      {
        label: "Produits publiés",
        value: dashboard.publishedProducts || 0,
      },
      {
        label: "Brouillons",
        value: dashboard.draftProducts || 0,
      },
    ];
  }, [dashboard]);

  return (
    <SellerShell
      title="Dashboard vendeur"
      subtitle="Vue globale sur l’activité commerciale"
      actions={
        <div style={{ display: "flex", gap: 12 }}>
          <Link
            to="/seller/products/new"
            style={primaryLink}
          >
            Ajouter un produit
          </Link>
          <Link
            to="/seller/orders"
            style={secondaryLink}
          >
            Voir les commandes
          </Link>
        </div>
      }
    >
      {loading ? (
        <div>Chargement du dashboard...</div>
      ) : (
        <>
          <SellerStatsCards cards={cards} />

          <section>
            <h2>Commandes récentes</h2>
            <SellerOrdersTable
              orders={dashboard?.recentOrders ?? []}
              readOnly
              onStatusChange={() => {}}
            />
          </section>
        </>
      )}
    </SellerShell>
  );
}

const primaryLink = {
  background: "#111827",
  color: "#fff",
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: 10,
  fontWeight: 700,
};

const secondaryLink = {
  background: "#f3f4f6",
  color: "#111827",
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: 10,
  fontWeight: 700,
};
