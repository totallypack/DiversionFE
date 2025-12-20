import { apiPost } from "../utils/apiClient";

const apiUrl = "/api/auth";

export const register = (userData) => apiPost(`${apiUrl}/register`, userData);

export const login = (credentials) => apiPost(`${apiUrl}/login`, credentials);

export const logout = () => apiPost(`${apiUrl}/logout`);
