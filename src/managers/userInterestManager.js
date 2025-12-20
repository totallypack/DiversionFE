import { apiGet, apiPost, apiDelete } from "../utils/apiClient";

const apiUrl = "/api/userinterests";

export const getMyInterests = () => apiGet(apiUrl);

export const addInterest = (subInterestId) =>
  apiPost(apiUrl, { subInterestId });

export const removeInterest = (userInterestId) =>
  apiDelete(`${apiUrl}/${userInterestId}`);

export const removeInterestBySubInterestId = (subInterestId) =>
  apiDelete(`${apiUrl}/subinterest/${subInterestId}`);
