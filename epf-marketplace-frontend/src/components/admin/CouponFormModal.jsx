import { useEffect, useState } from "react";

function toDateTimeLocalValue(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (number) => String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

const EMPTY_FORM = {
  code: "",
  type: "fixed",
  value: "",
  usage_limit: "",
  expires_at: "",
  is_active: true,
  description: "",
};

export default function CouponFormModal({
  open,
  initialData = null,
  loading = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code ?? "",
        type: initialData.type ?? "fixed",
        value: initialData.value ?? "",
        usage_limit: initialData.usage_limit ?? "",
        expires_at: toDateTimeLocalValue(initialData.expires_at),
        is_active: initialData.is_active ?? true,
        description: initialData.description ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      usage_limit: form.usage_limit === "" ? null : Number(form.usage_limit),
      ends_at: form.expires_at || null,
      is_active: Boolean(form.is_active),
      description: form.description.trim() || null,
    };

    await onSubmit(payload);
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <div className="page-header" style={{ marginBottom: 18 }}>
          <div>
            <p className="eyebrow">{initialData ? "Édition coupon" : "Nouveau coupon"}</p>
            <h2 style={{ margin: 0 }}>
              {initialData ? "Modifier le coupon" : "Créer un coupon"}
            </h2>
          </div>

          <button type="button" className="outline-button" onClick={onClose} disabled={loading}>
            Fermer
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <label className="form-field">
              <span>Code</span>
              <input
                className="form-input"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="EPF10"
                required
              />
            </label>

            <label className="form-field">
              <span>Type</span>
              <select className="form-input" name="type" value={form.type} onChange={handleChange}>
                <option value="fixed">Montant fixe</option>
                <option value="percent">Pourcentage</option>
              </select>
            </label>

            <label className="form-field">
              <span>Valeur</span>
              <input
                className="form-input"
                type="number"
                min="0"
                step="0.01"
                name="value"
                value={form.value}
                onChange={handleChange}
                placeholder="10"
                required
              />
            </label>

            <label className="form-field">
              <span>Limite d’utilisation</span>
              <input
                className="form-input"
                type="number"
                min="0"
                name="usage_limit"
                value={form.usage_limit}
                onChange={handleChange}
                placeholder="100"
              />
            </label>

            <label className="form-field">
              <span>Date d’expiration</span>
              <input
                className="form-input"
                type="datetime-local"
                name="expires_at"
                value={form.expires_at}
                onChange={handleChange}
              />
            </label>

            <label
              className="form-field"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                minHeight: 46,
                alignSelf: "end",
              }}
            >
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              <span>Coupon actif</span>
            </label>
          </div>

          <label className="form-field">
            <span>Description</span>
            <textarea
              className="form-input"
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              placeholder="Coupon promotionnel de lancement"
            />
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" }}>
            <button type="button" className="outline-button" onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Enregistrement..." : initialData ? "Mettre à jour" : "Créer le coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const backdropStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.55)",
  display: "grid",
  placeItems: "center",
  padding: 20,
  zIndex: 1000,
};

const modalStyle = {
  width: "min(920px, 100%)",
  background: "#ffffff",
  borderRadius: 20,
  padding: 24,
  boxShadow: "0 30px 80px rgba(15, 23, 42, 0.25)",
  maxHeight: "90vh",
  overflowY: "auto",
};
