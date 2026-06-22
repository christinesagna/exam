import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const cardStylesByTone = {
  green: {
    background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    border: "1px solid #bbf7d0",
    accent: "#166534",
  },
  blue: {
    background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    border: "1px solid #bfdbfe",
    accent: "#1d4ed8",
  },
  amber: {
    background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    border: "1px solid #fde68a",
    accent: "#b45309",
  },
  slate: {
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    border: "1px solid #cbd5e1",
    accent: "#0f172a",
  },
};

export default function AdminStatCard({ label, value, helper, icon, tone = "green" }) {
  const palette = cardStylesByTone[tone] || cardStylesByTone.green;

  return (
    <article
      className="app-card"
      style={{
        padding: 20,
        background: palette.background,
        border: palette.border,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, color: "#475569", fontSize: 14, fontWeight: 600 }}>{label}</p>
          <p style={{ margin: "10px 0 6px", fontSize: 32, fontWeight: 800, color: palette.accent }}>{value}</p>
          {helper ? <p style={{ margin: 0, color: "#64748b", lineHeight: 1.5 }}>{helper}</p> : null}
        </div>
        <div
          aria-hidden="true"
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            fontSize: 22,
            background: "rgba(255,255,255,0.75)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
          }}
        >
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
    </article>
  );
}
