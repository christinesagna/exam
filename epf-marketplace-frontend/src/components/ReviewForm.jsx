import { useState } from "react";
import { createReview, deleteReview } from "../services/productService";
 
/**
 * ReviewForm – formulaire d'ajout d'avis + bouton suppression
   
 */
export default function ReviewForm({
  productId,
  existingReview = null,
  onReviewSubmitted,
  onReviewDeleted,
}) {
  const [rating, setRating]   = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [hover, setHover]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);
 
  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Choisis une note entre 1 et 5 étoiles.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await createReview(productId, { rating, comment });
      const newReview = res?.review ?? res?.data?.data ?? res?.data ?? res;
      setSuccess("Avis publié avec succès !");
      onReviewSubmitted?.(newReview);
    } catch (e) {
      setError(
        e?.response?.data?.message ?? "Erreur lors de la publication de l'avis."
      );
    } finally {
      setLoading(false);
    }
  };
 
  const handleDelete = async () => {
    if (!existingReview) return;
    if (!window.confirm("Supprimer ton avis ?")) return;
    setLoading(true);
    try {
      await deleteReview(existingReview.id);
      onReviewDeleted?.(existingReview.id);
    } catch {
      setError("Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };
 
  // Si l'avis existe déjà → afficher avec option suppression
  if (existingReview && !success) {
    return (
      <div style={{
        padding: 16, border: "1px solid #d1fae5", borderRadius: 10,
        background: "#f0fdf4", marginBottom: 16,
      }}>
        <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 14 }}>
          ✅ Tu as déjà posté un avis
        </p>
        <div style={{ color: "#f59e0b", fontSize: 20, marginBottom: 6 }}>
          {"★".repeat(existingReview.rating)}{"☆".repeat(5 - existingReview.rating)}
        </div>
        {existingReview.comment && (
          <p style={{ fontSize: 14, color: "#374151", margin: "0 0 12px" }}>
            {existingReview.comment}
          </p>
        )}
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: "6px 14px", background: "#fef2f2", color: "#b91c1c",
            border: "1px solid #fca5a5", borderRadius: 6, cursor: "pointer", fontSize: 13,
          }}
        >
          {loading ? "Suppression…" : "Supprimer mon avis"}
        </button>
      </div>
    );
  }
 
  return (
    <div style={{
      padding: 20, border: "1px solid #e5e7eb",
      borderRadius: 12, background: "#fafafa", marginBottom: 24,
    }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>
        Laisser un avis
      </h3>
 
      {/* Étoiles interactives */}
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>Ta note *</p>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 28, color: star <= (hover || rating) ? "#f59e0b" : "#d1d5db",
                padding: 0, transition: "color .1s",
              }}
              aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
            {["", "Très mauvais", "Mauvais", "Correct", "Bien", "Excellent"][rating]}
          </p>
        )}
      </div>
 
      {/* Commentaire */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, color: "#6b7280", display: "block", marginBottom: 6 }}>
          Commentaire (optionnel)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Décris ton expérience avec ce produit…"
          rows={3}
          maxLength={1000}
          style={{
            width: "100%", padding: "10px 12px", border: "1px solid #d1d5db",
            borderRadius: 8, fontSize: 14, resize: "vertical",
            fontFamily: "inherit", outline: "none", boxSizing: "border-box",
          }}
        />
        <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "right", margin: "2px 0 0" }}>
          {comment.length}/1000
        </p>
      </div>
 
      {/* Messages */}
      {error && (
        <p style={{ fontSize: 13, color: "#b91c1c", marginBottom: 10 }}>{error}</p>
      )}
      {success && (
        <p style={{ fontSize: 13, color: "#16a34a", marginBottom: 10 }}>{success}</p>
      )}
 
      {/* Bouton soumettre */}
      <button
        onClick={handleSubmit}
        disabled={loading || rating === 0}
        style={{
          padding: "10px 24px", background: rating === 0 ? "#e5e7eb" : "#2563eb",
          color: rating === 0 ? "#9ca3af" : "#fff",
          border: "none", borderRadius: 8, fontWeight: 600,
          cursor: rating === 0 ? "default" : "pointer", fontSize: 14,
        }}
      >
        {loading ? "Publication…" : "Publier l'avis"}
      </button>
    </div>
  );
}