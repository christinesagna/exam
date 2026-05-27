import { useState } from "react";
import { useNavigate } from "react-router-dom";
 
/**
 * SearchBar – barre de recherche globale
 * Props :
 *   defaultValue : string  – valeur initiale (depuis URL ?q=...)
 *   onSearch     : fn(query) – appelé lors de la soumission
 *   placeholder  : string
 */
export default function SearchBar({
  defaultValue = "",
  onSearch,
  placeholder = "Rechercher un produit, un vendeur…",
}) {
  const [query, setQuery] = useState(defaultValue);
  const navigate = useNavigate();
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (onSearch) {
      onSearch(trimmed);
    } else {
      // Navigation par défaut vers la page de recherche
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };
 
  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        width: "100%",
        maxWidth: 560,
      }}
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Recherche"
        style={{
          flex: 1,
          padding: "10px 16px",
          fontSize: 14,
          border: "1px solid #d1d5db",
          borderRight: "none",
          borderRadius: "8px 0 0 8px",
          outline: "none",
          background: "#fff",
          color: "#111",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          fontSize: 14,
          fontWeight: 600,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "0 8px 8px 0",
          cursor: "pointer",
        }}
      >
        🔍
      </button>
    </form>
  );
}