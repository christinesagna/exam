import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { orderService } from "../../services/orderService";
import { useToast } from "../../hooks/useToast";

function normalizeOrder(payload) {
  const root = payload?.data ?? payload ?? {};
  return root?.order ?? root?.data ?? root;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const toast = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const status = useMemo(() => order?.status || "unknown", [order]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await orderService.getOrderById(id);
      setOrder(normalizeOrder(data));
    } catch {
      setError("Impossible de charger le détail de la commande.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await orderService.cancelOrder(id);
      toast.success("Commande annulée.");
      await loadOrder();
    } catch {
      toast.error("Impossible d'annuler cette commande.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return <ErrorMessage message="Commande introuvable." />;

  const items = order.items || order.order_items || [];
  const total = Number(order.total_amount ?? order.total ?? order.amount ?? 0);

  return (
    <section>
      <Link to="/orders" style={{ color: "#2563eb", textDecoration: "none" }}>
        <FontAwesomeIcon icon={faArrowLeft} /> Retour à mes commandes
      </Link>

      <div
        style={{
          marginTop: 20,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ marginTop: 0, marginBottom: 8 }}>Commande #{order.id}</h1>
            <p style={{ margin: "4px 0", color: "#4b5563" }}>
              Statut : <strong>{status}</strong>
            </p>
            <p style={{ margin: "4px 0", color: "#4b5563" }}>
              Date :{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleString("fr-FR")
                : "—"}
            </p>
          </div>

          {status === "pending" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              style={{
                border: "none",
                background: "#dc2626",
                color: "#fff",
                padding: "12px 16px",
                borderRadius: 10,
                fontWeight: 700,
                cursor: "pointer",
                height: "fit-content",
              }}
            >
              {cancelling ? "Annulation..." : "Annuler la commande"}
            </button>
          )}
        </div>

        <div style={{ marginTop: 24 }}>
          <h2>Articles</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {items.map((item, index) => {
              const product = item.product || {};
              const quantity = Number(item.quantity ?? 1);
              const unitPrice = Number(
                item.unit_price ?? item.price ?? product.price ?? 0
              );
              const lineTotal = Number(item.total ?? unitPrice * quantity);

              return (
                <div
                  key={item.id || index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: 14,
                    border: "1px solid #f1f5f9",
                    borderRadius: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {product.title || product.name || `Produit #${item.product_id}`}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: 14 }}>
                      {quantity} × {unitPrice.toFixed(2)} FCFA
                    </div>
                  </div>

                  <strong>{lineTotal.toFixed(2)} FCFA</strong>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
          <span style={{ fontSize: 20, fontWeight: 800 }}>
            {total.toFixed(2)} FCFA
          </span>
        </div>
      </div>
    </section>
  );
}
