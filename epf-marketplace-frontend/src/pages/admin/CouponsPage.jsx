// src/pages/admin/CouponsPage.jsx
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminCouponsTable from "../../components/admin/AdminCouponsTable";
import CouponFormModal from "../../components/admin/CouponFormModal";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import { adminService } from "../../services/adminService";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyCouponId, setBusyCouponId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const loadCoupons = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const payload = await adminService.getCoupons();
      setCoupons(payload.coupons);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Impossible de charger les coupons."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const handleCreate = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);

      if (editingCoupon) {
        await adminService.updateCoupon(editingCoupon.id, payload);
        toast.success("Coupon mis à jour avec succès.");
      } else {
        await adminService.createCoupon(payload);
        toast.success("Coupon créé avec succès.");
      }

      handleCloseModal();
      await loadCoupons();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "L'enregistrement du coupon a échoué."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (coupon) => {
    const confirmed = window.confirm(`Supprimer le coupon "${coupon.code}" ?`);
    if (!confirmed) return;

    try {
      setBusyCouponId(coupon.id);
      const response = await adminService.deleteCoupon(coupon.id);
      toast.success(response?.message || "Coupon supprimé.");
      await loadCoupons();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "La suppression du coupon a échoué."
      );
    } finally {
      setBusyCouponId(null);
    }
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <h1>Gestion des coupons</h1>
          <p className="page-subtitle">
            Gérez les réductions disponibles pour les acheteurs.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="outline-button" onClick={loadCoupons}>
            Recharger
          </button>
          <button type="button" className="primary-button" onClick={handleCreate}>
            Nouveau coupon
          </button>
        </div>
      </div>

      {loading ? <Loader text="Chargement des coupons..." /> : null}
      {!loading ? <ErrorMessage message={error} /> : null}

      {!loading && !error ? (
        <div className="app-card" style={{ display: "grid", gap: 18 }}>
          <strong style={{ color: "#0f172a" }}>
            {coupons.length} coupon{coupons.length > 1 ? "s" : ""}
          </strong>

          <AdminCouponsTable
            coupons={coupons}
            busyCouponId={busyCouponId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      ) : null}

      <CouponFormModal
        open={isModalOpen}
        initialData={editingCoupon}
        loading={saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </section>
  );
}