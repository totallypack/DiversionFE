import { apiGet, apiPost, apiDelete } from "../utils/apiClient";

const apiUrl = "/api/friendships";

export const getMyFriends = () => apiGet(`${apiUrl}/my`);

export const searchUsers = (query) =>
  apiGet(`${apiUrl}/search?query=${encodeURIComponent(query)}`);

export const addFriend = (friendId) => apiPost(apiUrl, { friendId });

export const removeFriend = (friendId) => apiDelete(`${apiUrl}/${friendId}`);

export const checkFriendship = (otherUserId) =>
  apiGet(`${apiUrl}/check/${otherUserId}`);
