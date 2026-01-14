import { apiGet, apiPost, apiDelete } from "../utils/apiClient";

const apiUrl = "/api/reports";

export const createReport = (reportedEntityType, reportedEntityId, reason, details = null) =>
  apiPost(apiUrl, {
    reportedEntityType,
    reportedEntityId,
    reason,
    details,
  });

export const getMyReports = () => apiGet(`${apiUrl}/my`);

export const getReport = (reportId) => apiGet(`${apiUrl}/${reportId}`);

export const deleteReport = (reportId) => apiDelete(`${apiUrl}/${reportId}`);
