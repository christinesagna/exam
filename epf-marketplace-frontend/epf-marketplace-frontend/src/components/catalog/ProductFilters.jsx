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
        padding: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        background: "#fff",
        height: "fit-content",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ margin: 0 }}>Filtres</h3>
        <button
          onClick={onReset}
          style={{
            border: "none",
            background: "transparent",
            color: "#2563eb",
            cursor: "pointer",
          }}
        >
          Réinitialiser
        </button>
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label>Catégorie</label>
        <select
          value={values.category_id || ""}
          onChange={(e) => handleFieldChange("category_id", e.target.value)}
          style={inputStyle}
        >
          <option value="">Toutes</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label>Prix minimum</label>
        <input
          type="number"
          value={values.min_price || ""}
          onChange={(e) => handleFieldChange("min_price", e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label>Prix maximum</label>
        <input
          type="number"
          value={values.max_price || ""}
          onChange={(e) => handleFieldChange("max_price", e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label>Trier par</label>
        <select
          value={values.sort || "latest"}
          onChange={(e) => handleFieldChange("sort", e.target.value)}
          style={inputStyle}
        >
          <option value="latest">Plus récents</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
          <option value="popular">Populaires</option>
        </select>
      </div>
    </aside>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
};
