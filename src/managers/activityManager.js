import { apiGet } from "../utils/apiClient";

const apiUrl = "/api/activity";

export const getFriendActivityFeed = () => apiGet(`${apiUrl}/feed`);
