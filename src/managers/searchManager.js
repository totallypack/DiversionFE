import { apiGet } from "../utils/apiClient";

const apiUrl = "/api/search";

export const search = (query, type = null) => {
  const params = new URLSearchParams();
  if (query) params.append("query", query);
  if (type) params.append("type", type);

  return apiGet(`${apiUrl}?${params.toString()}`);
};
