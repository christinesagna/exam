// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "40px",
        padding: "20px 0",
        borderTop: "1px solid #e5e7eb",
        color: "#6b7280",
        fontSize: "14px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <span>© {new Date().getFullYear()} EPF Marketplace</span>
        <span>Frontend React — Sprint 0</span>
      </div>
    </footer>
  );
}
