const sizeMap = {
  sm: 18,
  md: 30,
  lg: 44,
};

export default function Loader({ size = "md", text = "Chargement..." }) {
  const dimension = sizeMap[size] || sizeMap.md;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: dimension,
            height: dimension,
            borderRadius: "50%",
            border: "3px solid #dbeafe",
            borderTopColor: "#2563eb",
            animation: "spin 1s linear infinite",
          }}
        />
        {text ? <span style={{ color: "#6b7280", fontSize: 14 }}>{text}</span> : null}
      </div>
    </div>
  );
}
