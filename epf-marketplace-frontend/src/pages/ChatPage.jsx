import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getMessagesWith, sendMessage } from "../services/messageService";
 
export default function ChatPage() {
  const { userId } = useParams();
  const navigate   = useNavigate();
 
  const [messages, setMessages]   = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [content, setContent]     = useState("");
  const [loading, setLoading]     = useState(true);
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState(null);
  const bottomRef                 = useRef(null);
 
  // Id de l'utilisateur connecté (à adapter avec AuthContext)
  const myId = Number(localStorage.getItem("user_id"));
 
  // Chargement des messages
  useEffect(() => {
    setLoading(true);
    getMessagesWith(userId)
      .then((res) => {
        const data = res.data.data ?? res.data;
        setMessages(Array.isArray(data) ? data : data.messages ?? []);
        setOtherUser(data.user ?? null);
      })
      .catch(() => setError("Impossible de charger la conversation."))
      .finally(() => setLoading(false));
  }, [userId]);
 
  // Scroll automatique vers le bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 
  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed || sending) return;
 
    setSending(true);
    try {
      const res = await sendMessage({ receiver_id: Number(userId), content: trimmed });
      const newMsg = res.data.data ?? res.data;
      setMessages((prev) => [...prev, newMsg]);
      setContent("");
    } catch {
      setError("Erreur lors de l'envoi du message.");
    } finally {
      setSending(false);
    }
  };
 
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
 
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "calc(100vh - 64px)", maxWidth: 700, margin: "0 auto",
      padding: "0 16px",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "16px 0 12px",
        borderBottom: "1px solid #e5e7eb",
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate("/messages")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 18 }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "#dbeafe", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontWeight: 700, color: "#1d4ed8", fontSize: 16,
        }}>
          {otherUser?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>
            {otherUser?.name ?? "Conversation"}
          </p>
          {otherUser?.role && (
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
              {otherUser.role === "seller" ? "Vendeur" : "Acheteur"}
            </p>
          )}
        </div>
      </div>
 
      {/* Zone des messages */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "16px 0", display: "flex",
        flexDirection: "column", gap: 10,
      }}>
        {loading && <p style={{ color: "#6b7280", textAlign: "center" }}>Chargement…</p>}
        {error   && <p style={{ color: "#b91c1c", textAlign: "center" }}>{error}</p>}
 
        {!loading && messages.length === 0 && (
          <p style={{ color: "#9ca3af", textAlign: "center", marginTop: 40 }}>
            Début de la conversation. Envoie un premier message !
          </p>
        )}
 
        {messages.map((msg, i) => {
          const isMe = msg.sender_id === myId || msg.sender?.id === myId;
          return (
            <MessageBubble key={msg.id ?? i} message={msg} isMe={isMe} />
          );
        })}
        <div ref={bottomRef} />
      </div>
 
      {/* Zone de saisie */}
      <div style={{
        display: "flex", gap: 10, alignItems: "flex-end",
        padding: "12px 0 16px",
        borderTop: "1px solid #e5e7eb",
        flexShrink: 0,
      }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écris un message… (Entrée pour envoyer)"
          rows={2}
          style={{
            flex: 1, padding: "10px 14px",
            border: "1px solid #d1d5db", borderRadius: 12,
            fontSize: 14, resize: "none", outline: "none",
            fontFamily: "inherit", lineHeight: 1.5,
          }}
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || sending}
          style={{
            padding: "10px 20px",
            background: !content.trim() || sending ? "#e5e7eb" : "#2563eb",
            color: !content.trim() || sending ? "#9ca3af" : "#fff",
            border: "none", borderRadius: 10,
            fontWeight: 600, fontSize: 14, cursor: "pointer",
            flexShrink: 0, height: 44,
          }}
        >
          {sending ? "…" : "Envoyer"}
        </button>
      </div>
    </div>
  );
}
 
function MessageBubble({ message, isMe }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: isMe ? "flex-end" : "flex-start",
    }}>
      <div style={{
        maxWidth: "70%", padding: "10px 14px",
        background: isMe ? "#2563eb" : "#f3f4f6",
        color: isMe ? "#fff" : "#111",
        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        fontSize: 14, lineHeight: 1.5,
      }}>
        <p style={{ margin: 0 }}>{message.content}</p>
        <p style={{
          margin: "4px 0 0", fontSize: 10,
          color: isMe ? "rgba(255,255,255,.6)" : "#9ca3af",
          textAlign: "right",
        }}>
          {message.created_at
            ? new Date(message.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
            : ""}
        </p>
      </div>
    </div>
  );
}