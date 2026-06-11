import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";
import messageService from "../../services/messageService";
import ConversationList from "../../components/messaging/ConversationList";
import MessageThread from "../../components/messaging/MessageThread";

export default function MessagingPage() {
  const { userId: routeUserId } = useParams();
  const { user } = useAuth();

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
        messageService.getUnreadCount(),
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
      const data = await messageService.getMessagesWith(targetUserId);
      setMessages(data);
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
      setSelectedUserId(conversations[0].userId);
    }
  }, [conversations, routeUserId, selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      loadThread(selectedUserId);
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

  const handleSend = async (content) => {
    if (!selectedUserId) return;

    try {
      setSending(true);

      const created = await messageService.sendMessage({
        receiver_id: selectedUserId,
        content,
      });

      setMessages((prev) => [...prev, created]);
      await loadSidebar();
    } catch (error) {
      toast.error("Impossible d'envoyer le message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        minHeight: "80vh",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        overflow: "hidden",
        margin: 24,
        background: "#fff",
      }}
    >
      <ConversationList
        conversations={conversations}
        selectedUserId={selectedUserId}
        onSelect={setSelectedUserId}
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
  );
}
