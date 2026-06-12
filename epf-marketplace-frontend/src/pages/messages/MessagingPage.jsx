import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";
import messageService from "../../services/messageService";
import ConversationList from "../../components/messaging/ConversationList";
import MessageThread from "../../components/messaging/MessageThread";

export default function MessagingPage() {
  const { userId: routeUserId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(routeUserId || null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loadingSidebar, setLoadingSidebar] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const loadSidebar = async () => {
    try {
      setLoadingSidebar(true);
      const [conversationData, unread] = await Promise.all([
        messageService.getConversations(),
        messageService.getUnreadCount().catch(() => 0),
      ]);

      setConversations(conversationData);
      setUnreadCount(unread);
    } catch (error) {
      toast.error("Impossible de charger les conversations");
    } finally {
      setLoadingSidebar(false);
    }
  };

  const loadThread = async (targetUserId) => {
    if (!targetUserId) return;
    try {
      setLoadingMessages(true);
      setMessages([]);
      const data = await messageService.getMessagesWith(targetUserId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Impossible de charger les messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadSidebar();
  }, []);

  useEffect(() => {
    if (routeUserId) {
      setSelectedUserId(routeUserId);
    }
  }, [routeUserId]);

  useEffect(() => {
    if (!routeUserId && !selectedUserId && conversations.length > 0) {
      setSelectedUserId(String(conversations[0].userId));
    }
  }, [conversations, routeUserId, selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      loadThread(selectedUserId);
      navigate(`/messages/${selectedUserId}`, { replace: true });
    }
  }, [selectedUserId]);

  const activeConversation = useMemo(() => {
    const existing = conversations.find(
      (item) => String(item.userId) === String(selectedUserId)
    );

    if (existing) return existing;

    if (selectedUserId) {
      return {
        id: selectedUserId,
        userId: selectedUserId,
        name: `Utilisateur #${selectedUserId}`,
        lastMessage: "",
      };
    }

    return null;
  }, [conversations, selectedUserId]);

  const handleSelectConversation = (userId) => {
    setSelectedUserId(String(userId));
  };

  const handleSend = async (content) => {
    if (!selectedUserId) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      senderId: user?.id,
      receiverId: selectedUserId,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      setSending(true);
      const created = await messageService.sendMessage({
        recipient_id: Number(selectedUserId), // ✅ corrigé : receiver_id → recipient_id
        content,
      });

      setMessages((prev) =>
        prev.map((m) => (m.id === tempMessage.id ? created : m))
      );
      await loadSidebar();
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      toast.error("Impossible d'envoyer le message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>
        Messagerie
        {unreadCount > 0 && (
          <span
            style={{
              marginLeft: 10,
              background: "#dc2626",
              color: "#fff",
              borderRadius: 20,
              padding: "2px 10px",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
          </span>
        )}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          minHeight: "75vh",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <ConversationList
          conversations={conversations}
          selectedUserId={selectedUserId}
          onSelect={handleSelectConversation}
          unreadCount={unreadCount}
          loading={loadingSidebar}
        />

        <MessageThread
          conversation={activeConversation}
          messages={messages}
          currentUserId={user?.id}
          sending={sending}
          onSend={handleSend}
          loading={loadingMessages}
        />
      </div>
    </div>
  );
}
