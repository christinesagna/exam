export default function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  error = "",
  className = "",
  iconLeft = null,
  iconRight = null,
  ...rest
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      {label && (
        <label htmlFor={name} style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
          {label}
        </label>
      )}

      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {iconLeft && <span style={{ position: "absolute", left: 12 }}>{iconLeft}</span>}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            width: "100%",
            borderRadius: 10,
            border: `1px solid ${error ? "#ef4444" : "#d1d5db"}`,
            padding: `10px ${iconRight ? 42 : 14}px 10px ${iconLeft ? 42 : 14}px`,
            background: disabled ? "#f3f4f6" : "#ffffff",
          }}
          className={className}
          {...rest}
        />
        {iconRight && <span style={{ position: "absolute", right: 12 }}>{iconRight}</span>}
      </div>

      {error && <p style={{ margin: 0, color: "#dc2626", fontSize: 13 }}>{error}</p>}
    </div>
  );
}
