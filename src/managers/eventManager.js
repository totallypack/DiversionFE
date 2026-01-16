import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiClient";

const apiUrl = "/api/events";

export const getAllEvents = (skip = 0, take = 50) =>
  apiGet(`${apiUrl}?skip=${skip}&take=${take}`);

export const getEventById = (id) => apiGet(`${apiUrl}/${id}`);

export const getEventsByInterest = (interestTagId, skip = 0, take = 50) =>
  apiGet(`${apiUrl}/interest/${interestTagId}?skip=${skip}&take=${take}`);

export const getMyEvents = () => apiGet(`${apiUrl}/my`);

export const getUserEvents = (userId) => apiGet(`${apiUrl}/user/${userId}`);

export const getRsvpdEvents = () => apiGet(`${apiUrl}/rsvpd`);

export const getNearbyEvents = (zipCode) =>
  apiGet(`${apiUrl}/nearby?zipCode=${zipCode}`);

export const createEvent = (eventData) => apiPost(apiUrl, eventData);

export const updateEvent = (id, eventData) => apiPut(`${apiUrl}/${id}`, eventData);

export const deleteEvent = (id) => apiDelete(`${apiUrl}/${id}`);
