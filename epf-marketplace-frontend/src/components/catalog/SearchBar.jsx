import { useState } from "react";

export default function SearchBar({
  initialValue = "",
  onSearch,
  placeholder = "Rechercher un produit...",
}) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "8px",
        width: "100%",
        marginBottom: "16px",
      }}
    >
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: "12px 14px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
        }}
      />

      <button
        type="submit"
        style={{
          padding: "12px 18px",
          border: "none",
          borderRadius: "8px",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Rechercher
      </button>
    </form>
  );
}
