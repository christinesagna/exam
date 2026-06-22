// src/pages/admin/AdminDashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBox, faReceipt } from "@fortawesome/free-solid-svg-icons";
import AdminStatCard from "../../components/admin/AdminStatCard";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import { adminService } from "../../services/adminService";

function formatCurrency(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statCards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        label: "Utilisateurs",
        value: stats.users_count,
        helper: "Total des comptes enregistrés sur la marketplace.",
        icon: faUsers,
        tone: "green",
      },
      {
        label: "Produits",
        value: stats.products_count,
        helper: "Produits publiés, brouillons et archivés inclus.",
        icon: faBox,
        tone: "blue",
      },
      {
        label: "Commandes",
        value: stats.orders_count,
        helper: "Nombre total de commandes passées.",
        icon: faReceipt,
        tone: "amber",
      },
      {
        label: "Chiffre d'affaires",
        value: formatCurrency(stats.total_revenue),
        helper: "Somme des commandes hors statut annulé.",
        tone: "slate",
      },
    ];
  }, [stats]);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");
        const payload = await adminService.getStats();
        if (isMounted) {
          setStats(payload);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Impossible de charger les statistiques administrateur."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <h1></h1>
          <p className="page-subtitle">
            
          </p>
        </div>

        <button type="button" className="outline-button" onClick={() => window.location.reload()}>
          Actualiser
        </button>
      </div>

      {loading ? <Loader text="Chargement des statistiques admin..." /> : null}
      {!loading ? <ErrorMessage message={error} /> : null}

      {!loading && !error && stats ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          {statCards.map((card) => (
            <AdminStatCard key={card.label} {...card} />
          ))}
        </div>
      ) : null}
    </section>
  );
}