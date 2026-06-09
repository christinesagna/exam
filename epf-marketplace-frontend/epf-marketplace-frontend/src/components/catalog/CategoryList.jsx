export default function CategoryList({
  categories = [],
  activeCategory = "",
  onSelect,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        marginBottom: "16px",
      }}
    >
      <button
        onClick={() => onSelect?.("")}
        style={buttonStyle(activeCategory === "")}
      >
        Toutes
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect?.(String(category.id))}
          style={buttonStyle(String(activeCategory) === String(category.id))}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

function buttonStyle(active) {
  return {
    padding: "8px 14px",
    borderRadius: "999px",
    border: active ? "1px solid #2563eb" : "1px solid #d1d5db",
    background: active ? "#dbeafe" : "#fff",
    color: active ? "#1d4ed8" : "#111827",
    cursor: "pointer",
  };
}
