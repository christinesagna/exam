
import axiosClient from "./api/axiosClient";

const rootData = (payload) => payload?.data ?? payload;

const pickArray = (payload, keys = []) => {
  const root = rootData(payload);

  if (Array.isArray(root)) return root;

  for (const key of keys) {
    if (Array.isArray(root?.[key])) return root[key];
  }

  if (Array.isArray(root?.data)) return root.data;
  return [];
};

const normalizeConversation = (item = {}) => {
  const otherUser =
    item.other_user || item.user || item.recipient || item.participant || {};

  return {
    id: item.id ?? item.conversation_id ?? otherUser.id,
    userId: otherUser.id ?? item.user_id ?? item.recipient_id,
    name: otherUser.name ?? item.name ?? "Utilisateur",
    avatar: otherUser.avatar ?? null,
    lastMessage:
      item.last_message?.content ??
      item.last_message ??
      item.preview ??
      item.content ??
      "",
    lastMessageAt:
      item.last_message?.created_at ??
      item.updated_at ??
      item.created_at ??
      null,
    unreadCount: Number(item.unread_count ?? item.unreadCount ?? 0),
    raw: item,
  };
};

const normalizeMessage = (item = {}) => ({
  id: item.id ?? `${item.sender_id}-${item.receiver_id}-${item.created_at}`,
  senderId: item.sender_id ?? item.sender?.id ?? null,
  receiverId: item.receiver_id ?? item.receiver?.id ?? null,
  content: item.content ?? item.message ?? item.body ?? "",
  createdAt: item.created_at ?? item.sent_at ?? item.updated_at ?? null,
  sender: item.sender ?? null,
  receiver: item.receiver ?? null,
  raw: item,
});

export const messageService = {
  async getConversations() {
    const { data } = await axiosClient.get("/messages/conversations");
    return pickArray(data, ["conversations", "items", "threads"]).map(
      normalizeConversation
    );
  },

  async getMessagesWith(userId) {
    const { data } = await axiosClient.get(`/messages/with/${userId}`);
    return pickArray(data, ["messages", "items"]).map(normalizeMessage);
  },

  async getUnreadCount() {
    const { data } = await axiosClient.get("/messages/unread-count");
    const root = rootData(data);

    return Number(
      root?.count ??
        root?.unread_count ??
        root?.data?.count ??
        root?.data?.unread_count ??
        0
    );
  },

  async sendMessage(payload) {
    const { data } = await axiosClient.post("/messages", payload);
    const root = rootData(data);
    return normalizeMessage(root?.message ?? root);
  },
};

export default messageService;

 
// GET /api/messages/conversations
export const getConversations = () =>
  apiClient.get("/messages/conversations");
 
// GET /api/messages/with/:userId
export const getMessagesWith = (userId, params = {}) =>
  apiClient.get(`/messages/with/${userId}`, { params });
 
// POST /api/messages
export const sendMessage = (data) =>
  apiClient.post("/messages", data);
// data : { receiver_id, content }
 

export const getUnreadCount = () =>
  apiClient.get("/messages/unread-count");
 

