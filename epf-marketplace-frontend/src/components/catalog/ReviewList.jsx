export default function ReviewList({ reviews = [] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
        Aucun avis pour le moment.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {reviews.map((review) => (
        <div
          key={review.id}
          style={{
            padding: "16px",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <h4 style={{ margin: "0 0 4px 0" }}>{review.reviewer_name || "Utilisateur"}</h4>
            <span style={{ color: "#f59e0b" }}>★ {review.rating}</span>
          </div>
          <p style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: 14 }}>
            {review.created_at ? new Date(review.created_at).toLocaleDateString("fr-FR") : ""}
          </p>
          <p style={{ margin: 0, lineHeight: 1.5 }}>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
