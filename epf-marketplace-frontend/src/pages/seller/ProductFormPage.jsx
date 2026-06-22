import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  getProduct,
  createProduct,
  updateProduct,
  getCategories,
} from "../../services/productService";
 
export default function ProductFormPage() {
  const { id }   = useParams(); // défini = modification, undefined = création
  const navigate = useNavigate();
  const isEdit   = Boolean(id);
 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(isEdit);
  const [errors, setErrors]         = useState({});
  const [success, setSuccess]       = useState(null);
  const [imagePreview, setImagePreview] = useState([]);
 
  const [form, setForm] = useState({
    title:       "",
    description: "",
    price:       "",
    stock:       "",
    category_id: "",
    status:      "active",
    is_on_sale:  false,
    sale_price:  "",
    images:      [], // fichiers File
  });
 
  // Chargement des catégories
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data ?? res.data))
      .catch(() => {});
  }, []);
 
  // En mode édition : pré-remplir le formulaire
  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    getProduct(id)
      .then((res) => {
        const p = res.data.data ?? res.data;
        setForm({
          title:       p.title ?? "",
          description: p.description ?? "",
          price:       p.price ?? "",
          stock:       p.stock ?? "",
          category_id: p.category?.id ?? "",
          status:      p.status ?? "active",
          is_on_sale:  p.is_on_sale ?? false,
          sale_price:  p.sale_price ?? "",
          images:      [],
        });
        if (p.images?.length > 0) {
          setImagePreview(p.images.map((img) => img.url));
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [id, isEdit]);
 
  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: null }));
  };
 
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setForm((f) => ({ ...f, images: files }));
    setImagePreview(files.map((f) => URL.createObjectURL(f)));
  };
 
  const validate = () => {
    const errs = {};
    if (!form.title.trim())    errs.title    = "Le titre est obligatoire.";
    if (!form.price)           errs.price    = "Le prix est obligatoire.";
    if (Number(form.price) < 0) errs.price   = "Le prix doit être positif.";
    if (!form.category_id)     errs.category_id = "Choisis une catégorie.";
    if (form.is_on_sale && !form.sale_price)
      errs.sale_price = "Saisis le prix promotionnel.";
    return errs;
  };
 
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
 
    setLoading(true);
    setErrors({});
 
    const data = new FormData();
    data.append("title",       form.title);
    data.append("description", form.description);
    data.append("price",       form.price);
    data.append("stock",       form.stock || 0);
    data.append("category_id", form.category_id);
    data.append("status",      form.status);
    data.append("is_on_sale",  form.is_on_sale ? 1 : 0);
    if (form.is_on_sale) data.append("sale_price", form.sale_price);
    form.images.forEach((img) => data.append("images[]", img));
    if (isEdit) data.append("_method", "PUT");
 
    try {
      if (isEdit) {
        await updateProduct(id, data);
      } else {
        await createProduct(data);
      }
      setSuccess(isEdit ? "Produit mis à jour !" : "Produit créé avec succès !");
      setTimeout(() => navigate("/seller/products"), 1200);
    } catch (e) {
      const apiErrors = e?.response?.data?.errors ?? {};
      setErrors(apiErrors);
      if (!Object.keys(apiErrors).length) {
        setErrors({ general: "Une erreur est survenue." });
      }
    } finally {
      setLoading(false);
    }
  };
 
  if (fetching) return <p style={{ padding: 40, color: "#6b7280" }}>Chargement…</p>;
 
  return (
    <div style={{ padding: "24px 32px", maxWidth: 700, margin: "0 auto" }}>
      {/* En-tête */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => navigate("/seller/products")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 14 }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Mes produits
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
          {isEdit ? "Modifier le produit" : "Nouveau produit"}
        </h1>
      </div>
 
      {/* Succès */}
      {success && (
        <div style={{ padding: 14, background: "#f0fdf4", borderRadius: 8, color: "#16a34a", marginBottom: 20, fontWeight: 500 }}>
          ✅ {success}
        </div>
      )}
 
      {errors.general && (
        <div style={{ padding: 14, background: "#fef2f2", borderRadius: 8, color: "#b91c1c", marginBottom: 20 }}>
          {errors.general}
        </div>
      )}
 
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Titre */}
        <Field label="Titre du produit *" error={errors.title}>
          <input
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Ex: Casque Audio Pro"
            style={inputStyle(errors.title)}
          />
        </Field>
 
        {/* Description */}
        <Field label="Description" error={errors.description}>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Décris ton produit en détail…"
            rows={4}
            style={{ ...inputStyle(), resize: "vertical", fontFamily: "inherit" }}
          />
        </Field>
 
        {/* Prix + Stock */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Prix (€) *" error={errors.price}>
            <input
              type="number" min={0} step="0.01"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="0.00"
              style={inputStyle(errors.price)}
            />
          </Field>
          <Field label="Stock" error={errors.stock}>
            <input
              type="number" min={0}
              value={form.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              placeholder="0"
              style={inputStyle(errors.stock)}
            />
          </Field>
        </div>
 
        {/* Catégorie */}
        <Field label="Catégorie *" error={errors.category_id}>
          <select
            value={form.category_id}
            onChange={(e) => handleChange("category_id", e.target.value)}
            style={inputStyle(errors.category_id)}
          >
            <option value="">Sélectionne une catégorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
 
        {/* Statut */}
        <Field label="Statut">
          <select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            style={inputStyle()}
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </Field>
 
        {/* Promo */}
        <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.is_on_sale}
              onChange={(e) => handleChange("is_on_sale", e.target.checked)}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            <span style={{ fontSize: 14, fontWeight: 500 }}>Mettre en promotion</span>
          </label>
          {form.is_on_sale && (
            <div style={{ marginTop: 12 }}>
              <Field label="Prix promotionnel (€) *" error={errors.sale_price}>
                <input
                  type="number" min={0} step="0.01"
                  value={form.sale_price}
                  onChange={(e) => handleChange("sale_price", e.target.value)}
                  placeholder="0.00"
                  style={inputStyle(errors.sale_price)}
                />
              </Field>
            </div>
          )}
        </div>
 
        {/* Images */}
        <Field label="Images du produit" error={errors.images}>
          <input
            type="file"
            multiple accept="image/*"
            onChange={handleImages}
            style={{ fontSize: 13 }}
          />
          {imagePreview.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              {imagePreview.map((src, i) => (
                <img key={i} src={src} alt=""
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
              ))}
            </div>
          )}
        </Field>
 
        {/* Boutons */}
        <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1, padding: "12px 0",
              background: loading ? "#93c5fd" : "#2563eb",
              color: "#fff", border: "none", borderRadius: 8,
              fontWeight: 600, fontSize: 15, cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer le produit"}
          </button>
          <button
            onClick={() => navigate("/seller/products")}
            style={{
              padding: "12px 24px", background: "#f3f4f6",
              color: "#374151", border: "1px solid #e5e7eb",
              borderRadius: 8, cursor: "pointer", fontSize: 14,
            }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
 
// ── Composants internes 
 
function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6, color: "#374151" }}>
        {label}
      </label>
      {children}
      {error && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#b91c1c" }}>{error}</p>}
    </div>
  );
}
 
const inputStyle = (error) => ({
  width: "100%", padding: "10px 12px",
  border: `1px solid ${error ? "#fca5a5" : "#d1d5db"}`,
  borderRadius: 8, fontSize: 14, outline: "none",
  boxSizing: "border-box", color: "#111",
  background: error ? "#fef2f2" : "#fff",
});