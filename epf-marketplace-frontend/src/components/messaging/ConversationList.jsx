const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("fr-FR") : "";

export default function ConversationList({
  conversations = [],
  selectedUserId,
  onSelect,
  unreadCount = 0,
  loading = false,
}) {
  return (
    <aside
      style={{
        borderRight: "1px solid #e5e7eb",
        minWidth: 320,
        background: "#fff",
      }}
    >
      <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb" }}>
        <h2 style={{ margin: 0 }}>Messagerie</h2>
        <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
          Non lus : {unreadCount}
        </p>
      </div>

      {loading ? (
        <div style={{ padding: 16 }}>Chargement...</div>
      ) : conversations.length === 0 ? (
        <div style={{ padding: 16, color: "#6b7280" }}>Aucune conversation</div>
      ) : (
        conversations.map((conv) => {
          const active = String(selectedUserId) === String(conv.userId);

          return (
            <button
              key={`${conv.id}-${conv.userId}`}
              type="button"
              onClick={() => onSelect(conv.userId)}
              style={{
                width: "100%",
                textAlign: "left",
                border: "none",
                borderBottom: "1px solid #f3f4f6",
                padding: 16,
                cursor: "pointer",
                background: active ? "#eff6ff" : "#fff",
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
              >
                <strong>{conv.name}</strong>
                <small style={{ color: "#6b7280" }}>
                  {formatDate(conv.lastMessageAt)}
                </small>
              </div>

              <div style={{ marginTop: 8, color: "#4b5563" }}>
                {conv.lastMessage}
              </div>

              {conv.unreadCount > 0 ? (
                <div style={{ marginTop: 8, color: "#1d4ed8", fontWeight: 700 }}>
                  {conv.unreadCount} non lu(s)
                </div>
              ) : null}
            </button>
          );
        })
      )}
    </aside>
  );
}
