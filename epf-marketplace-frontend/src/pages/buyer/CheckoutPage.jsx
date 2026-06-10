import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";
import { orderService } from "../../services/orderService";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { cart, clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    postal_code: "",
    address: "",
    city: "",
    notes: "",
    coupon_code: "",
    payment_method: "cash_on_delivery",
  });

  if (!cart.items.length) {
    return (
      <EmptyState
        title="Impossible de valider"
        message="Ton panier est vide. Ajoute d'abord des produits."
      />
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.full_name || !form.phone || !form.postal_code || !form.address || !form.city) {
      toast.error("Merci de renseigner tous les champs obligatoires.");
      return;
    }

    const payload = {
      shipping_address: form.address,
      shipping_city: form.city,
      shipping_postal_code: form.postal_code,
      shipping_phone: form.phone,
      notes: form.notes,
      coupon_code: form.coupon_code || undefined,
    };

    try {
      setSubmitting(true);
      const result = await orderService.createOrder(payload);
      const order = result?.order || result?.data || result;

      await clearCart({ silent: true });
      toast.success("Commande créée avec succès.");

      if (order?.id) {
        navigate(`/orders/${order.id}`);
      } else {
        navigate("/orders");
      }
    } catch {
      toast.error("Impossible de créer la commande.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1 style={{ marginTop: 0 }}>Checkout</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Vérifie tes informations avant de finaliser ta commande.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 0.8fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Informations de livraison</h2>

          <FormField
            label="Nom complet"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />

          <FormField
            label="Téléphone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <FormField
            label="Adresse"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <FormField
            label="Code postal"
            name="postal_code"
            value={form.postal_code}
            onChange={handleChange}
            required
          />

          <FormField
            label="Ville"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />

          <FormField
            label="Code coupon"
            name="coupon_code"
            value={form.coupon_code}
            onChange={handleChange}
          />

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Mode de paiement
            </label>
            <select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="cash_on_delivery">Paiement à la livraison</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="card">Carte</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="Instructions particulières"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              border: "none",
              background: "#2563eb",
              color: "#fff",
              padding: "14px 16px",
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {submitting ? "Validation..." : "Confirmer la commande"}
          </button>
        </form>

        <aside
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Résumé commande</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cart.items.map((item) => (
              <div key={item.id} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12 }}>
                <div style={{ fontWeight: 700 }}>
                  {item.product?.title || item.product?.name || `Produit #${item.product_id}`}
                </div>
                <div style={{ color: "#6b7280", fontSize: 14 }}>
                  {item.quantity} × {Number(item.unitPrice).toFixed(2)} FCFA
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <SummaryRow label="Sous-total" value={`${Number(cart.subtotal).toFixed(2)} FCFA`} />
            <SummaryRow label="Frais" value="0.00 FCFA" />
            <SummaryRow label="Total" value={`${Number(cart.total).toFixed(2)} FCFA`} bold />
          </div>
        </aside>
      </div>
    </section>
  );
}

function FormField({ label, required = false, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
        {label} {required ? "*" : ""}
      </label>
      <input {...props} style={inputStyle} />
    </div>
  );
}

function SummaryRow({ label, value, bold = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
      <span style={{ color: "#6b7280" }}>{label}</span>
      <span style={{ fontWeight: bold ? 800 : 600 }}>{value}</span>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: 14,
  boxSizing: "border-box",
};
