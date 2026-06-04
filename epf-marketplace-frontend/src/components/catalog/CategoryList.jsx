export default function CategoryList({ categories = [], activeCategory, onSelect }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        background: "#fff",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Catégories</h3>
      <button
        type="button"
        onClick={() => onSelect?.(null)}
        style={{
          marginBottom: "12px",
          background: "transparent",
          border: "none",
          color: activeCategory ? "#2563eb" : "#111827",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
        }}
      >
        Toutes les catégories
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect?.(category.id)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "8px 0",
            border: "none",
            background: "transparent",
            color: activeCategory === category.id ? "#2563eb" : "#374151",
            fontWeight: activeCategory === category.id ? 600 : 400,
            cursor: "pointer",
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
