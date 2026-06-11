import apiClient from "./apiClient";
 
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
 