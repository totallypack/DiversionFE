import { apiGet, apiPost, apiDelete } from "../utils/apiClient";

const apiUrl = "/api/notifications";

export const getNotifications = () => apiGet(apiUrl);

export const markAsRead = (notificationId) =>
  apiPost(`${apiUrl}/${notificationId}/read`);

export const markAllAsRead = () =>
  apiPost(`${apiUrl}/read-all`);

export const deleteNotification = (notificationId) =>
  apiDelete(`${apiUrl}/${notificationId}`);
