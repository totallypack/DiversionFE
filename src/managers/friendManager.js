import { apiGet, apiPost, apiDelete } from "../utils/apiClient";

const apiUrl = "/api/friendships";
const requestApiUrl = "/api/friendrequest";

export const getMyFriends = () => apiGet(`${apiUrl}/my`);

export const searchUsers = (query) =>
  apiGet(`${apiUrl}/search?query=${encodeURIComponent(query)}`);

export const addFriend = (friendId) => apiPost(apiUrl, { friendId });

export const removeFriend = (friendId) => apiDelete(`${apiUrl}/${friendId}`);

export const checkFriendship = (otherUserId) =>
  apiGet(`${apiUrl}/check/${otherUserId}`);

// Friend Request functions
export const sendFriendRequest = (receiverId) =>
  apiPost(`${requestApiUrl}/send`, { receiverId });

export const getReceivedRequests = () =>
  apiGet(`${requestApiUrl}/received`);

export const getSentRequests = () =>
  apiGet(`${requestApiUrl}/sent`);

export const acceptFriendRequest = (requestId) =>
  apiPost(`${requestApiUrl}/${requestId}/accept`);

export const rejectFriendRequest = (requestId) =>
  apiPost(`${requestApiUrl}/${requestId}/reject`);

export const cancelFriendRequest = (requestId) =>
  apiDelete(`${requestApiUrl}/${requestId}`);

export const getFriendRequestStatus = (otherUserId) =>
  apiGet(`${requestApiUrl}/status/${otherUserId}`);
