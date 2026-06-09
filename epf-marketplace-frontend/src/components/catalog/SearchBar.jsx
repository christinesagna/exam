import { useEffect, useState } from "react";

export default function SearchBar({
  initialValue = "",
  onSearch,
  placeholder = "Rechercher un produit...",
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: 12,
        width: "100%",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <div
        style={{
          flex: "1 1 320px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#ffffff",
          border: "1px solid #cbd5e1",
          borderRadius: 16,
          padding: "0 14px",
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
        }}
      >
        <span style={{ fontSize: 18 }} aria-hidden="true">
          🔎
        </span>
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: "14px 0",
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 15,
            color: "#0f172a",
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: "14px 22px",
          border: "none",
          borderRadius: 16,
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 700,
          boxShadow: "0 14px 24px rgba(37, 99, 235, 0.22)",
        }}
      >
        Rechercher
      </button>
    </form>
  );
}
