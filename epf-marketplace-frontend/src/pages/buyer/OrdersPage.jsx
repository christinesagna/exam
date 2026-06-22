import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import { orderService } from "../../services/orderService";
import { useToast } from "../../hooks/useToast";

function normalizeOrders(payload) {
  const root = payload?.data ?? payload ?? {};
  return (
    root?.orders ??
    root?.items ??
    root?.data ??
    (Array.isArray(root) ? root : [])
  );
}

export default function OrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const hasOrders = useMemo(() => orders.length > 0, [orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await orderService.getMyOrders();
      setOrders(normalizeOrders(data));
    } catch {
      setError("Impossible de charger tes commandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      setCancellingId(orderId);
      await orderService.cancelOrder(orderId);
      toast.success("Commande annulée.");
      await loadOrders();
    } catch {
      toast.error("Impossible d'annuler cette commande.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <section>
      <h1 style={{ marginTop: 0 }}>Mes commandes</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Suis l’état de toutes tes commandes buyer.
      </p>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && !hasOrders && (
        <EmptyState
          title="Aucune commande"
          message="Tu n'as pas encore passé de commande."
        />
      )}

      {!loading && !error && hasOrders && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => {
            const status = order.status || "unknown";
            const total = Number(order.total_amount ?? order.total ?? order.amount ?? 0);

            return (
              <article
                key={order.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 20,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h3 style={{ marginTop: 0, marginBottom: 8 }}>
                    Commande #{order.id}
                  </h3>
                  <p style={{ margin: "4px 0", color: "#4b5563" }}>
                    Statut : <StatusBadge status={status} />
                  </p>
                  <p style={{ margin: "4px 0", color: "#4b5563" }}>
                    Total : <strong>{total.toFixed(2)} FCFA</strong>
                  </p>
                  <p style={{ margin: "4px 0", color: "#6b7280", fontSize: 14 }}>
                    Créée le{" "}
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString("fr-FR")
                      : "—"}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Link
                    to={`/orders/${order.id}`}
                    style={{
                      textDecoration: "none",
                      border: "1px solid #d1d5db",
                      color: "#111827",
                      padding: "10px 14px",
                      borderRadius: 10,
                      fontWeight: 600,
                    }}
                  >
                    Voir détail
                  </Link>

                  {status === "pending" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingId === order.id}
                      style={{
                        border: "none",
                        background: "#dc2626",
                        color: "#fff",
                        padding: "10px 14px",
                        borderRadius: 10,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {cancellingId === order.id ? "Annulation..." : "Annuler"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { bg: "#fef3c7", color: "#92400e", label: "en attente" },
    paid: { bg: "#dcfce7", color: "#166534", label: "payée" },
    shipped: { bg: "#dbeafe", color: "#1d4ed8", label: "expédié" },
    cancelled: { bg: "#fee2e2", color: "#991b1b", label: "annulé" },
  };

  const current = map[status] || {
    bg: "#e5e7eb",
    color: "#374151",
    label: status,
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        background: current.bg,
        color: current.color,
        fontWeight: 700,
        fontSize: 12,
        textTransform: "uppercase",
      }}
    >
      {current.label}
    </span>
  );
}
