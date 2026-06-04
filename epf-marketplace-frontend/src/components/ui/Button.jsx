const palette = {
  primary: {
    background: "#2563eb",
    color: "#ffffff",
    border: "1px solid #2563eb",
  },
  secondary: {
    background: "#4b5563",
    color: "#ffffff",
    border: "1px solid #4b5563",
  },
  danger: {
    background: "#dc2626",
    color: "#ffffff",
    border: "1px solid #dc2626",
  },
  ghost: {
    background: "#ffffff",
    color: "#111827",
    border: "1px solid #d1d5db",
  },
};

const sizes = {
  sm: { padding: "8px 12px", fontSize: 14 },
  md: { padding: "10px 16px", fontSize: 15 },
  lg: { padding: "12px 20px", fontSize: 16 },
};

export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 10,
        fontWeight: 600,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.7 : 1,
        transition: "all 0.2s ease",
        ...palette[variant],
        ...sizes[size],
      }}
    >
      {loading && <span aria-hidden="true">⏳</span>}
      {children}
    </button>
  );
}
