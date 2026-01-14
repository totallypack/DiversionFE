import { apiGet, apiPost, apiDelete } from "../utils/apiClient";

const apiUrl = "/api/userblocks";

export const getBlockedUsers = () => apiGet(apiUrl);

export const blockUser = (blockedUserId, reason = null) =>
  apiPost(apiUrl, { blockedUserId, reason });

export const unblockUser = (blockId) => apiDelete(`${apiUrl}/${blockId}`);

export const getBlockingStatus = (otherUserId) =>
  apiGet(`${apiUrl}/status/${otherUserId}`);
