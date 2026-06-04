function Loader({ text = "Chargement..." }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          borderRadius: 999,
          background: "#eff6ff",
          color: "#1d4ed8",
          fontWeight: 600,
        }}
      >
        <span aria-hidden="true">⏳</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

export default Loader;
