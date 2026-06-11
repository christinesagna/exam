import { useMemo, useState } from "react";

const formatTime = (value) =>
  value ? new Date(value).toLocaleString("fr-FR") : "";

export default function MessageThread({
  conversation,
  messages = [],
  currentUserId,
  sending = false,
  onSend,
  loading = false,
}) {
  const [content, setContent] = useState("");

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      ),
    [messages]
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await onSend(content.trim());
    setContent("");
  };

  if (!conversation) {
    return (
      <section style={{ padding: 24 }}>
        <h2>Sélectionne une conversation</h2>
      </section>
    );
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <header
        style={{ padding: 16, borderBottom: "1px solid #e5e7eb", background: "#fff" }}
      >
        <h2 style={{ margin: 0 }}>{conversation.name}</h2>
      </header>

      <div style={{ flex: 1, overflow: "auto", padding: 16, background: "#f9fafb" }}>
        {loading ? (
          <p style={{ color: "#6b7280" }}>Chargement des messages...</p>
        ) : sortedMessages.length === 0 ? (
          <p style={{ color: "#6b7280" }}>Aucun message pour le moment.</p>
        ) : (
          sortedMessages.map((message) => {
            const mine = String(message.senderId) === String(currentUserId);

            return (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: mine ? "flex-end" : "flex-start",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: 12,
                    borderRadius: 14,
                    background: mine ? "#111827" : "#fff",
                    color: mine ? "#fff" : "#111827",
                    border: mine ? "none" : "1px solid #e5e7eb",
                  }}
                >
                  <div>{message.content}</div>
                  <small style={{ opacity: 0.75, display: "block", marginTop: 8 }}>
                    {formatTime(message.createdAt)}
                  </small>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={submit}
        style={{
          display: "flex",
          gap: 12,
          padding: 16,
          borderTop: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrire un message..."
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #d1d5db",
          }}
        />
        <button
          type="submit"
          disabled={sending}
          style={{
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "12px 18px",
            cursor: "pointer",
          }}
        >
          {sending ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </section>
  );
}
