import { apiGet, apiPost } from "../utils/apiClient";

// Community Messages
export const getCommunityMessages = (communityId, skip = 0, take = 50) =>
  apiGet(`/api/communities/${communityId}/messages?skip=${skip}&take=${take}`);

export const sendCommunityMessage = (communityId, content, replyToMessageId = null) =>
  apiPost(`/api/communities/${communityId}/messages`, {
    content,
    replyToMessageId,
  });

// Direct Messages
export const getConversations = () => apiGet("/api/directmessages/conversations");

export const getMessagesWith = (otherUserId, skip = 0, take = 50) =>
  apiGet(`/api/directmessages/with/${otherUserId}?skip=${skip}&take=${take}`);

export const sendDirectMessage = (receiverId, content) =>
  apiPost("/api/directmessages/send", { receiverId, content });

export const getUnreadMessageCount = () =>
  apiGet("/api/directmessages/unread-count");
