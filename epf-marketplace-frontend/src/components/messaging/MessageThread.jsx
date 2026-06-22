import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

const formatTime = (value) =>
  value ? new Date(value).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "";

export default function MessageThread({
  conversation,
  messages = [],
  currentUserId,
  sending = false,
  onSend,
  loading = false,
}) {
  const [content, setContent] = useState("");
  const bottomRef = useRef(null);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      ),
    [messages]
  );

  // Auto-scroll vers le bas quand les messages changent
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || sending) return;
    setContent("");
    await onSend(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!conversation) {
    return (
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "75vh",
          color: "#9ca3af",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 48 }}><FontAwesomeIcon icon={faComment} /></div>
        <h2 style={{ margin: 0 }}>Sélectionne une conversation</h2>
        <p style={{ margin: 0, fontSize: 14 }}>
          Choisis un contact à gauche pour commencer à écrire.
        </p>
      </section>
    );
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", height: "75vh" }}>
      {/* En-tête conversation */}
      <header
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "#2563eb",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          {(conversation.name || "?")[0].toUpperCase()}
        </div>
        <h2 style={{ margin: 0, fontSize: 16 }}>{conversation.name}</h2>
      </header>

      {/* Zone des messages */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: 16,
          background: "#f9fafb",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {loading ? (
          <p style={{ color: "#6b7280", textAlign: "center", marginTop: 32 }}>
            Chargement des messages...
          </p>
        ) : sortedMessages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#9ca3af",
              marginTop: 32,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>✉️</div>
            <p>Aucun message. Soyez le premier à écrire !</p>
          </div>
        ) : (
          sortedMessages.map((message) => {
            const mine = String(message.senderId) === String(currentUserId);
            const isTemp = String(message.id).startsWith("temp-");

            return (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: mine ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "10px 14px",
                    borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: mine ? "#2563eb" : "#fff",
                    color: mine ? "#fff" : "#111827",
                    border: mine ? "none" : "1px solid #e5e7eb",
                    opacity: isTemp ? 0.7 : 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ lineHeight: 1.5 }}>{message.content}</div>
                  <small
                    style={{
                      opacity: 0.7,
                      display: "block",
                      marginTop: 4,
                      fontSize: 11,
                      textAlign: "right",
                    }}
                  >
                    {isTemp ? "Envoi..." : formatTime(message.createdAt)}
                  </small>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Formulaire d'envoi */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: 10,
          padding: "12px 16px",
          borderTop: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrire un message... (Entrée pour envoyer)"
          rows={1}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 20,
            border: "1px solid #d1d5db",
            resize: "none",
            fontFamily: "inherit",
            fontSize: 14,
            outline: "none",
            maxHeight: 100,
            overflowY: "auto",
          }}
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          style={{
            background: sending || !content.trim() ? "#9ca3af" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            padding: "10px 18px",
            cursor: sending || !content.trim() ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: 14,
            transition: "background 0.2s",
          }}
        >
          {sending ? "⏳" : "Envoyer ➤"}
        </button>
      </form>
    </section>
  );
}
