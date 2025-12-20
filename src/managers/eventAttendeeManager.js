import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiClient";

const apiUrl = "/api/eventattendees";

export const getEventAttendees = (eventId) =>
  apiGet(`${apiUrl}/event/${eventId}`);

export const getMyAttendance = () => apiGet(`${apiUrl}/my`);

export const getMyAttendanceForEvent = (eventId) =>
  apiGet(`${apiUrl}/event/${eventId}/me`);

export const rsvpToEvent = (eventId, status = "Going") =>
  apiPost(apiUrl, { eventId, status });

export const updateRsvp = (attendeeId, status) =>
  apiPut(`${apiUrl}/${attendeeId}`, { status });

export const deleteRsvp = (attendeeId) => apiDelete(`${apiUrl}/${attendeeId}`);
