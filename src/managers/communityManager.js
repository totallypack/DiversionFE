import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiClient";

const apiUrl = "/api/communities";

export const getPublicCommunities = () => apiGet(`${apiUrl}/public`);

export const getMyCommunities = () => apiGet(`${apiUrl}/my`);

export const getCommunity = (id) => apiGet(`${apiUrl}/${id}`);

export const createCommunity = (communityData) => apiPost(apiUrl, communityData);

export const updateCommunity = (id, communityData) =>
  apiPut(`${apiUrl}/${id}`, communityData);

export const deleteCommunity = (id) => apiDelete(`${apiUrl}/${id}`);

export const joinCommunity = (id) => apiPost(`${apiUrl}/${id}/join`);

export const leaveCommunity = (id) => apiPost(`${apiUrl}/${id}/leave`);

export const getCommunityMembers = (id) => apiGet(`${apiUrl}/${id}/members`);
