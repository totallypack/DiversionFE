import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiClient";

const apiUrl = "/api/events";

export const getAllEvents = () => apiGet(apiUrl);

export const getEventById = (id) => apiGet(`${apiUrl}/${id}`);

export const getEventsByInterest = (interestTagId) =>
  apiGet(`${apiUrl}/interest/${interestTagId}`);

export const getMyEvents = () => apiGet(`${apiUrl}/my`);

export const getUserEvents = (userId) => apiGet(`${apiUrl}/user/${userId}`);

export const getRsvpdEvents = () => apiGet(`${apiUrl}/rsvpd`);

export const createEvent = (eventData) => apiPost(apiUrl, eventData);

export const updateEvent = (id, eventData) => apiPut(`${apiUrl}/${id}`, eventData);

export const deleteEvent = (id) => apiDelete(`${apiUrl}/${id}`);
