export default function ProductFilters({
  categories = [],
  values,
  onChange,
  onReset,
}) {
  const handleFieldChange = (field, value) => {
    onChange?.({
      ...values,
      [field]: value,
    });
  };

  return (
    <aside
      style={{
        minWidth: "260px",
        padding: 20,
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        background: "#fff",
        height: "fit-content",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.04)",
        display: "grid",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18 }}>Filtres</h3>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
            Affine le catalogue selon tes préférences.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          style={{
            border: "none",
            background: "transparent",
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Réinitialiser
        </button>
      </div>

      {/* Catégorie */}
      <div>
        <label style={labelStyle}>Catégorie</label>
        <select
          value={values.category_id || ""}
          onChange={(e) => handleFieldChange("category_id", e.target.value)}
          style={inputStyle}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Prix min / max */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Prix minimum (FCFA)</label>
          <input
            type="number"
            min="0"
            value={values.min_price || ""}
            onChange={(e) => handleFieldChange("min_price", e.target.value)}
            placeholder="0"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Prix maximum (FCFA)</label>
          <input
            type="number"
            min="0"
            value={values.max_price || ""}
            onChange={(e) => handleFieldChange("max_price", e.target.value)}
            placeholder="Ex: 50000"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Trier par */}
      <div>
        <label style={labelStyle}>Trier par</label>
        <select
          value={values.sort || ""}
          onChange={(e) => handleFieldChange("sort", e.target.value)}
          style={inputStyle}
        >
          <option value="">Par défaut</option>
          <option value="newest">Plus récents</option>
          <option value="cheapest">Moins chers</option>
          <option value="expensive">Plus chers</option>
          <option value="popular">Plus vendus</option>
          <option value="most_rated">Mieux notés</option>
        </select>
      </div>

      {/* Indicateur de filtres actifs */}
      {(values.category_id || values.min_price || values.max_price || values.sort) && (
        <div
          style={{
            padding: "8px 12px",
            background: "#eff6ff",
            borderRadius: 10,
            fontSize: 13,
            color: "#2563eb",
          }}
        >
          ✓ Filtres actifs
        </div>
      )}
    </aside>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: 6,
  color: "#334155",
  fontSize: 13,
  fontWeight: 700,
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  background: "#f8fafc",
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
  fontSize: 14,
};
