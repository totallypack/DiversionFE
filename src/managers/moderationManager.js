import { apiGet, apiPost } from "../utils/apiClient";

const apiUrl = "/api/moderation";

export const getPendingReports = () => apiGet(`${apiUrl}/reports/pending`);

export const getAllReports = (status = null, skip = 0, take = 50) => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("skip", skip);
  params.append("take", take);

  return apiGet(`${apiUrl}/reports/all?${params.toString()}`);
};

export const reviewReport = (reportId, status, adminNotes = null, actionType = null, actionReason = null) =>
  apiPost(`${apiUrl}/reports/${reportId}/review`, {
    status,
    adminNotes,
    actionType,
    actionReason,
  });

export const banUser = (targetUserId, reason = null, notes = null) =>
  apiPost(`${apiUrl}/users/${targetUserId}/ban`, { reason, notes });

export const unbanUser = (targetUserId, reason = null, notes = null) =>
  apiPost(`${apiUrl}/users/${targetUserId}/unban`, { reason, notes });

export const getModerationActions = (targetUserId = null, skip = 0, take = 50) => {
  const params = new URLSearchParams();
  if (targetUserId) params.append("targetUserId", targetUserId);
  params.append("skip", skip);
  params.append("take", take);

  return apiGet(`${apiUrl}/actions?${params.toString()}`);
};

export const getModerationStats = () => apiGet(`${apiUrl}/stats`);
