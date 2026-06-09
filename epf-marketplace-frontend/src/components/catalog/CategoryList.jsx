export default function CategoryList({ categories = [], activeCategory, onSelect }) {
  return (
    <section
      style={{
        padding: 18,
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        background: "#fff",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>Catégories</h3>
        <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
          Navigue rapidement par univers produit.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <FilterChip
          active={!activeCategory}
          label="Toutes les catégories"
          onClick={() => onSelect?.("")}
        />

        {categories.map((category) => {
          const isActive = String(activeCategory) === String(category.id);

          return (
            <FilterChip
              key={category.id}
              active={isActive}
              label={category.name}
              onClick={() => onSelect?.(category.id)}
            />
          );
        })}
      </div>
    </section>
  );
}

function FilterChip({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: active ? "1px solid #2563eb" : "1px solid #cbd5e1",
        background: active ? "#eff6ff" : "#f8fafc",
        color: active ? "#1d4ed8" : "#334155",
        borderRadius: 999,
        padding: "10px 14px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 13,
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );
}
