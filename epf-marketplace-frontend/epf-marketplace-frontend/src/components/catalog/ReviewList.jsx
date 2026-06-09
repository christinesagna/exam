import EmptyState from "../common/EmptyState";

export default function ReviewList({ reviews = [] }) {
  if (!reviews.length) {
    return (
      <EmptyState
        title="Aucun avis"
        message="Ce produit n’a pas encore reçu d’avis."
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {reviews.map((review, index) => (
        <article
          key={review.id || index}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              gap: "12px",
            }}
          >
            <strong>{review.user?.name || review.author_name || "Utilisateur"}</strong>
            <span style={{ color: "#f59e0b" }}>
              {"★".repeat(Number(review.rating || 0))}
            </span>
          </div>

          <p style={{ margin: 0, color: "#374151" }}>
            {review.comment || review.content || "Pas de commentaire."}
          </p>
        </article>
      ))}
    </div>
  );
}
