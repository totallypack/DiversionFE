import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiClient";

const apiUrl = "/api/userprofile";

export const getMyProfile = () => apiGet(`${apiUrl}/me`);

export const createProfile = (profileData) => apiPost(apiUrl, profileData);

export const updateProfile = (profileData) => apiPut(apiUrl, profileData);

export const deleteProfile = () => apiDelete(apiUrl);

export const getUserProfile = (userId) => apiGet(`${apiUrl}/${userId}`);
