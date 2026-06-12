import axiosClient from "./api/axiosClient";

const apiClient = axiosClient;

const rootData = (payload) => payload?.data ?? payload;

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.messages)) return value.messages;
  if (Array.isArray(value?.conversations)) return value.conversations;
  if (Array.isArray(value?.threads)) return value.threads;
  return [];
}

const pickArray = (payload, keys = []) => {
  const root = rootData(payload);

  if (Array.isArray(root)) return root;

  for (const key of keys) {
    const candidate = root?.[key];
    const arrayCandidate = toArray(candidate);
    if (arrayCandidate.length > 0) return arrayCandidate;
  }

  if (Array.isArray(root?.data)) return root.data;
  return [];
};

const normalizeConversation = (item = {}) => {
  const otherUser =
    item.other_user ||
    item.with_user ||
    item.user ||
    item.recipient ||
    item.participant ||
    item.contact ||
    {};

  return {
    id: item.id ?? item.conversation_id ?? otherUser.id,
    userId:
      otherUser.id ??
      item.user_id ??
      item.recipient_id ??
      item.with_user_id ??
      null,
    name:
      otherUser.name ??
      otherUser.full_name ??
      item.name ??
      item.title ??
      "Utilisateur",
    avatar: otherUser.avatar ?? otherUser.photo ?? null,
    lastMessage:
      item.last_message?.content ??
      item.last_message?.message ??
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
  id:
    item.id ??
    item.message_id ??
    `${item.sender_id ?? "x"}-${item.receiver_id ?? "y"}-${
      item.created_at ?? item.sent_at ?? Date.now()
    }`,
  senderId: item.sender_id ?? item.sender?.id ?? item.from_user_id ?? null,
  receiverId: item.receiver_id ?? item.receiver?.id ?? item.to_user_id ?? null,
  content: item.content ?? item.message ?? item.body ?? item.text ?? "",
  createdAt: item.created_at ?? item.sent_at ?? item.updated_at ?? null,
  sender: item.sender ?? null,
  receiver: item.receiver ?? null,
  raw: item,
});

export const messageService = {
  async getConversations() {
    const { data } = await axiosClient.get("/messages/conversations");
    return pickArray(data, ["conversations", "items", "threads", "data"]).map(
      normalizeConversation
    );
  },

  async getMessagesWith(userId) {
    const { data } = await axiosClient.get(`/messages/with/${userId}`);
    const root = rootData(data);

    return (
      pickArray(root, ["messages", "items", "data"]).length > 0
        ? pickArray(root, ["messages", "items", "data"])
        : toArray(root?.conversation?.messages)
    ).map(normalizeMessage);
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
    return normalizeMessage(root?.message ?? root?.data ?? root);
  },
};

export default messageService;

// Compatibilité avec les anciens imports nommés
export const getConversations = () => apiClient.get("/messages/conversations");

export const getMessagesWith = (userId, params = {}) =>
  apiClient.get(`/messages/with/${userId}`, { params });

export const sendMessage = (data) => apiClient.post("/messages", data);

export const getUnreadCount = () => apiClient.get("/messages/unread-count");
