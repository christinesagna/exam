import { useEffect, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage";
import SellerOrdersTable from "../../components/seller/SellerOrdersTable";
import SellerWorkspaceTabs from "../../components/seller/SellerWorkspaceTabs";
import { useToast } from "../../hooks/useToast";
import { sellerService } from "../../services/sellerService";

const statusOptions = [
  { value: "", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmées" },
  { value: "shipped", label: "Expédiées" },
  { value: "delivered", label: "Livrées" },
];

export default function SellerOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      try {
        setLoading(true);
        setError("");
        const response = await sellerService.getOrders({
          page,
          per_page: 10,
          ...(status ? { status } : {}),
        });

        if (!ignore) {
          setOrders(response.items || []);
          setPagination(response.pagination || { current_page: 1, last_page: 1, total: 0 });
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.response?.data?.message || "Impossible de charger les commandes vendeur.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadOrders();
    return () => {
      ignore = true;
    };
  }, [page, status]);

  async function handleAdvanceStatus(orderId, nextStatus) {
    try {
      setUpdatingOrderId(orderId);
      await sellerService.updateOrderStatus(orderId, nextStatus);
      toast.success("Statut mis à jour avec succès.");

      const response = await sellerService.getOrders({
        page,
        per_page: 10,
        ...(status ? { status } : {}),
      });
      setOrders(response.items || []);
      setPagination(response.pagination || { current_page: 1, last_page: 1, total: 0 });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Échec de la mise à jour du statut.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  return (
    <section>
      <p style={{ margin: 0, color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
        Sprint 4 · Seller orders
      </p>
      <h1 style={{ margin: "8px 0 12px", fontSize: 32, color: "#0f172a" }}>Commandes reçues</h1>
      <p style={{ margin: "0 0 24px", color: "#475569", maxWidth: 900, lineHeight: 1.6 }}>
        Vue seller branchée sur <code>GET /api/seller/orders</code> avec changement d'état via
        <code> PUT /api/orders/{"{order}"}/status</code>. Le vendeur peut seulement progresser dans la chaîne
        <strong> pending → confirmed → shipped → delivered</strong>.
      </p>

      <SellerWorkspaceTabs />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <label htmlFor="seller-order-status" style={{ color: "#334155", fontWeight: 700 }}>
            Filtre statut
          </label>
          <select
            id="seller-order-status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            style={{
              border: "1px solid #cbd5e1",
              borderRadius: 10,
              padding: "10px 14px",
              minWidth: 220,
              background: "#fff",
            }}
          >
            {statusOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ color: "#64748b", fontSize: 14 }}>
          {pagination.total} commande(s) vendeur
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <SellerOrdersTable
        orders={orders}
        loading={loading}
        onAdvanceStatus={handleAdvanceStatus}
        updatingOrderId={updatingOrderId}
      />

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setPage((current) => Math.max(current - 1, 1))}
          disabled={page <= 1}
          style={{
            border: "1px solid #cbd5e1",
            background: page <= 1 ? "#e2e8f0" : "#ffffff",
            color: "#334155",
            borderRadius: 10,
            padding: "10px 14px",
            fontWeight: 700,
          }}
        >
          Précédent
        </button>

        <div style={{ alignSelf: "center", color: "#334155", fontWeight: 700 }}>
          Page {pagination.current_page} / {pagination.last_page}
        </div>

        <button
          type="button"
          onClick={() => setPage((current) => Math.min(current + 1, pagination.last_page || 1))}
          disabled={page >= (pagination.last_page || 1)}
          style={{
            border: "1px solid #cbd5e1",
            background: page >= (pagination.last_page || 1) ? "#e2e8f0" : "#ffffff",
            color: "#334155",
            borderRadius: 10,
            padding: "10px 14px",
            fontWeight: 700,
          }}
        >
          Suivant
        </button>
      </div>
    </section>
  );
}
