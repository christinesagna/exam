import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getConversations, getUnreadCount } from "../services/messageService";
 
export default function ConversationsPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
 
  useEffect(() => {
    setLoading(true);
    Promise.all([getConversations(), getUnreadCount()])
      .then(([convRes, unreadRes]) => {
        setConversations(convRes.data.data ?? convRes.data ?? []);
        setUnreadCount(unreadRes.data.unread_count ?? 0);
      })
      .catch(() => setError("Impossible de charger les conversations."))
      .finally(() => setLoading(false));
  }, []);
 
  return (
    <div style={{ padding: "24px 32px", maxWidth: 700, margin: "0 auto" }}>
      {/* En-tête */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Messages</h1>
        {unreadCount > 0 && (
          <span style={{
            background: "#ef4444", color: "#fff",
            fontSize: 12, fontWeight: 700,
            padding: "2px 8px", borderRadius: 20,
          }}>
            {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
          </span>
        )}
      </div>
 
      {loading && <p style={{ color: "#6b7280" }}>Chargement…</p>}
      {error   && (
        <div style={{ padding: 14, background: "#fef2f2", borderRadius: 8, color: "#b91c1c" }}>
          {error}
        </div>
      )}
 
      {/* État vide */}
      {!loading && !error && conversations.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
          <p style={{ fontSize: 16, fontWeight: 500 }}>Aucune conversation</p>
          <p style={{ fontSize: 13 }}>Contacte un vendeur depuis la fiche d'un produit.</p>
        </div>
      )}
 
      {/* Liste des conversations */}
      {!loading && conversations.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.user.id}
              conversation={conv}
              onClick={() => navigate(`/messages/${conv.user.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
 
function ConversationItem({ conversation, onClick }) {
  const { user, last_message, unread_count } = conversation;
  const hasUnread = unread_count > 0;
 
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px",
        background: hasUnread ? "#eff6ff" : "#fff",
        border: `1px solid ${hasUnread ? "#bfdbfe" : "#e5e7eb"}`,
        borderRadius: 12, cursor: "pointer",
        transition: "background .15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
      onMouseLeave={(e) => (e.currentTarget.style.background = hasUnread ? "#eff6ff" : "#fff")}
    >
      {/* Avatar */}
      <div style={{
        width: 46, height: 46, borderRadius: "50%",
        background: "#dbeafe", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, fontWeight: 700, color: "#1d4ed8",
      }}>
        {user.name?.[0]?.toUpperCase() ?? "?"}
      </div>
 
      {/* Infos */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{
            margin: 0, fontWeight: hasUnread ? 700 : 500,
            fontSize: 14, color: "#111",
          }}>
            {user.name}
          </p>
          {last_message?.created_at && (
            <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0 }}>
              {formatDate(last_message.created_at)}
            </span>
          )}
        </div>
        {last_message?.content && (
          <p style={{
            margin: "3px 0 0", fontSize: 13,
            color: hasUnread ? "#1d4ed8" : "#6b7280",
            fontWeight: hasUnread ? 600 : 400,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {last_message.content}
          </p>
        )}
      </div>
 
      {/* Badge non lus */}
      {hasUnread && (
        <span style={{
          background: "#2563eb", color: "#fff",
          fontSize: 11, fontWeight: 700,
          minWidth: 20, height: 20,
          borderRadius: 10, display: "flex",
          alignItems: "center", justifyContent: "center",
          padding: "0 6px", flexShrink: 0,
        }}>
          {unread_count}
        </span>
      )}
    </div>
  );
}
 
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now  = new Date();
  const diff = now - date;
  if (diff < 60000)      return "À l'instant";
  if (diff < 3600000)    return `${Math.floor(diff / 60000)}min`;
  if (diff < 86400000)   return `${Math.floor(diff / 3600000)}h`;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}