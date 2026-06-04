export default function FilterPanel({ filters = {}, categories = [], onChange, onReset }) {
  const sortOptions = [
    { value: "newest",     label: "Plus récents" },
    { value: "popular",    label: "Populaires" },
    { value: "cheapest",   label: "Prix croissant" },
    { value: "most_rated", label: "Mieux notés" },
  ];
 
  const handleChange = (key, value) => {
    onChange?.({ ...filters, [key]: value || undefined });
  };
 
  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        padding: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Filtres</h3>
        <button
          onClick={onReset}
          style={{
            background: "none",
            border: "none",
            fontSize: 12,
            color: "#6b7280",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Réinitialiser
        </button>
      </div>
 
      {/* Catégorie */}
      <div>
        <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
          Catégorie
        </label>
        <select
          value={filters.category_id ?? ""}
          onChange={(e) => handleChange("category_id", e.target.value)}
          style={selectStyle}
        >
          <option value="">Toutes</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
 
      {/* Prix */}
      <div>
        <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
          Prix (€)
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price ?? ""}
            min={0}
            onChange={(e) => handleChange("min_price", e.target.value)}
            style={{ ...inputStyle, width: "50%" }}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price ?? ""}
            min={0}
            onChange={(e) => handleChange("max_price", e.target.value)}
            style={{ ...inputStyle, width: "50%" }}
          />
        </div>
      </div>
 
      {/* Tri */}
      <div>
        <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
          Trier par
        </label>
        <select
          value={filters.sort ?? "newest"}
          onChange={(e) => handleChange("sort", e.target.value)}
          style={selectStyle}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
 
const selectStyle = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 13,
  background: "#fff",
  color: "#111",
  outline: "none",
};
 
const inputStyle = {
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 13,
  color: "#111",
  outline: "none",
};