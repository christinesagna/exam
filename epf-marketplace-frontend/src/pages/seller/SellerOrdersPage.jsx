import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import SellerShell from "../../components/seller/SellerShell";
import SellerOrdersTable from "../../components/seller/SellerOrdersTable";
import sellerService from "../../services/sellerService";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = status === "all" ? {} : { status };
      const data = await sellerService.getOrders(params);
      setOrders(data);
    } catch (error) {
      toast.error("Impossible de charger les commandes vendeur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [status]);

  const handleStatusChange = async (order, nextStatus) => {
    try {
      setLoadingId(order.id);
      await sellerService.updateOrderStatus(order.id, nextStatus);
      toast.success("Statut mis à jour");
      await loadOrders();
    } catch (error) {
      toast.error("Impossible de mettre à jour le statut");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <SellerShell
      title="Commandes vendeur"
      subtitle="Liste des commandes contenant vos produits"
      actions={
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
          }}
        >
          <option value="all">Tous</option>
<option value="pending">En attente</option>
<option value="confirmed">Confirmée</option>
<option value="shipped">Expédiée</option>
<option value="delivered">Livrée</option>
<option value="cancelled">Annulée</option>
        </select>
      }
    >
      {loading ? (
        <div>Chargement des commandes...</div>
      ) : (
        <SellerOrdersTable
          orders={orders}
          onStatusChange={handleStatusChange}
          loadingId={loadingId}
        />
      )}
    </SellerShell>
  );
}
