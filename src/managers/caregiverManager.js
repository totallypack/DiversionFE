import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiClient";

const requestApiUrl = "/api/caregiverrequest";
const relationshipApiUrl = "/api/carerelationship";

// Caregiver Requests
export const sendCaregiverRequest = (receiverId, requestMessage, permissions) =>
  apiPost(`${requestApiUrl}/send`, {
    receiverId,
    requestMessage,
    requestCanManageEvents: permissions?.requestCanManageEvents ?? true,
    requestCanManageProfile: permissions?.requestCanManageProfile ?? true,
    requestCanManageFriendships: permissions?.requestCanManageFriendships ?? true,
  });

export const getReceivedCaregiverRequests = () =>
  apiGet(`${requestApiUrl}/received`);

export const getSentCaregiverRequests = () =>
  apiGet(`${requestApiUrl}/sent`);

export const acceptCaregiverRequest = (requestId, permissions) =>
  apiPost(`${requestApiUrl}/${requestId}/accept`, {
    canManageEvents: permissions?.canManageEvents,
    canManageProfile: permissions?.canManageProfile,
    canManageFriendships: permissions?.canManageFriendships,
  });

export const rejectCaregiverRequest = (requestId) =>
  apiPost(`${requestApiUrl}/${requestId}/reject`);

export const cancelCaregiverRequest = (requestId) =>
  apiDelete(`${requestApiUrl}/${requestId}`);

export const getCaregiverRequestStatus = (otherUserId) =>
  apiGet(`${requestApiUrl}/status/${otherUserId}`);

// Care Relationships
export const getMyCaregivers = () =>
  apiGet(`${relationshipApiUrl}/my-caregivers`);

export const getMyRecipients = () =>
  apiGet(`${relationshipApiUrl}/my-recipients`);

export const getCareRelationship = (relationshipId) =>
  apiGet(`${relationshipApiUrl}/${relationshipId}`);

export const updateCareRelationshipPermissions = (relationshipId, permissions) =>
  apiPut(`${relationshipApiUrl}/${relationshipId}/permissions`, {
    canManageEvents: permissions?.canManageEvents,
    canManageProfile: permissions?.canManageProfile,
    canManageFriendships: permissions?.canManageFriendships,
  });

export const revokeCareRelationship = (relationshipId) =>
  apiPost(`${relationshipApiUrl}/${relationshipId}/revoke`);

export const reactivateCareRelationship = (relationshipId) =>
  apiPost(`${relationshipApiUrl}/${relationshipId}/reactivate`);

export const deleteCareRelationship = (relationshipId) =>
  apiDelete(`${relationshipApiUrl}/${relationshipId}`);

export const checkCareRelationship = (recipientId) =>
  apiGet(`${relationshipApiUrl}/check/${recipientId}`);
