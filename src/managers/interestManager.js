import { apiGet } from "../utils/apiClient";

const apiUrl = "/api";

export const getAllInterests = () => apiGet(`${apiUrl}/interests`);

export const getAllInterestsWithSubInterests = () =>
  apiGet(`${apiUrl}/interests/with_subinterests`);

export const getInterestById = (id) => apiGet(`${apiUrl}/interests/${id}`);

export const getSubInterestById = (id) => apiGet(`${apiUrl}/subinterests/${id}`);
