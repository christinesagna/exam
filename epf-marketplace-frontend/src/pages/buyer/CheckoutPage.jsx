// src/pages/buyer/CheckoutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";
import { orderService } from "../../services/orderService";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatMoney(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

/**
 * Calcule la remise à partir des infos du coupon validé et du sous-total.
 * Retourne un nombre positif (montant à déduire).
 */
function computeDiscount(couponData, subtotal) {
  if (!couponData) return 0;
  const type = String(couponData.type || "").toLowerCase();
  const value = Number(couponData.value || couponData.discount || 0);

  if (type === "percent") {
    return Math.min((subtotal * value) / 100, subtotal);
  }
  // fixed / montant fixe
  return Math.min(value, subtotal);
}

// ─── component ──────────────────────────────────────────────────────────────

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

  // coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponValidating, setCouponValidating] = useState(false);
  const [couponData, setCouponData] = useState(null);   // infos du coupon validé
  const [couponError, setCouponError] = useState("");

  if (!cart.items.length) {
    return (
      <EmptyState
        title="Impossible de valider"
        message="Ton panier est vide. Ajoute d'abord des produits."
      />
    );
  }

  const subtotal = Number(cart.subtotal || cart.total || 0);
  const discount = computeDiscount(couponData, subtotal);
  const total = Math.max(0, subtotal - discount);

  // ── handlers ────────────────────────────────────────────────────────────

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    setCouponError("");
    setCouponData(null);
    setCouponValidating(true);

    try {
      const result = await orderService.validateCoupon(code, subtotal);
      // l'API peut renvoyer { coupon: {...} } ou directement les champs
      const info = result?.coupon ?? result?.data ?? result;

      if (!info || (!info.type && !info.discount)) {
        setCouponError("Ce coupon est invalide ou expiré.");
        return;
      }

      setCouponData(info);
      toast.success(`Coupon "${code}" appliqué !`);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Coupon invalide ou expiré.";
      setCouponError(msg);
    } finally {
      setCouponValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponData(null);
    setCouponInput("");
    setCouponError("");
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
      ...(couponData ? { coupon_code: couponInput.trim().toUpperCase() } : {}),
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

  // ── render ──────────────────────────────────────────────────────────────

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
        {/* ── Formulaire livraison ── */}
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

          {/* ── Section coupon ── */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Code coupon
            </label>

            {couponData ? (
              /* coupon validé : affiche le badge de remise */
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#dcfce7",
                  border: "1px solid #bbf7d0",
                  borderRadius: 10,
                  padding: "10px 14px",
                }}
              >
                <span style={{ flex: 1, fontWeight: 700, color: "#166534" }}>
                  ✓ {couponInput.trim().toUpperCase()}
                  {couponData.type === "percent"
                    ? ` — ${couponData.value}% de réduction`
                    : ` — ${formatMoney(couponData.value || couponData.discount)} de réduction`}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#991b1b",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  Retirer
                </button>
              </div>
            ) : (
              /* coupon non encore validé : champ + bouton */
              <>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      if (couponError) setCouponError("");
                    }}
                    placeholder="EPF10"
                    style={{ ...inputStyle, flex: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponValidating || !couponInput.trim()}
                    style={{
                      border: "none",
                      background: "#2563eb",
                      color: "#fff",
                      padding: "0 18px",
                      borderRadius: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                      opacity: !couponInput.trim() ? 0.5 : 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {couponValidating ? "Vérification..." : "Appliquer"}
                  </button>
                </div>

                {couponError ? (
                  <p style={{ margin: "6px 0 0", color: "#b91c1c", fontSize: 13 }}>
                    {couponError}
                  </p>
                ) : null}
              </>
            )}
          </div>

          {/* ── Mode de paiement ── */}
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

          {/* ── Notes ── */}
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
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Validation..." : "Confirmer la commande"}
          </button>
        </form>

        {/* ── Résumé commande ── */}
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
                  {item.quantity} × {formatMoney(item.unitPrice)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <SummaryRow label="Sous-total" value={formatMoney(subtotal)} />
            <SummaryRow label="Frais de livraison" value={formatMoney(0)} />

            {discount > 0 ? (
              <SummaryRow
                label={`Coupon (${couponInput.trim().toUpperCase()})`}
                value={`− ${formatMoney(discount)}`}
                highlight
              />
            ) : null}

            <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 10, paddingTop: 10 }}>
              <SummaryRow label="Total" value={formatMoney(total)} bold />
            </div>
          </div>

          {discount > 0 ? (
            <p
              style={{
                marginTop: 12,
                padding: "8px 12px",
                background: "#dcfce7",
                borderRadius: 8,
                color: "#166534",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              🎉 Vous économisez {formatMoney(discount)} grâce au coupon !
            </p>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

// ─── sub-components ──────────────────────────────────────────────────────────

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

function SummaryRow({ label, value, bold = false, highlight = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
      <span style={{ color: highlight ? "#166534" : "#6b7280" }}>{label}</span>
      <span
        style={{
          fontWeight: bold ? 800 : 600,
          color: highlight ? "#166534" : undefined,
        }}
      >
        {value}
      </span>
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