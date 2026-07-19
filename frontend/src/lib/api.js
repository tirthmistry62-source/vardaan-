import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vax_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function setSession({ token, role, user }) {
  localStorage.setItem("vax_token", token);
  localStorage.setItem("vax_role", role);
  localStorage.setItem("vax_user", JSON.stringify(user));
}

export function getSession() {
  const token = localStorage.getItem("vax_token");
  const role = localStorage.getItem("vax_role");
  const userRaw = localStorage.getItem("vax_user");
  if (!token || !role) return null;
  try {
    return { token, role, user: userRaw ? JSON.parse(userRaw) : null };
  } catch {
    return { token, role, user: null };
  }
}

export function clearSession() {
  localStorage.removeItem("vax_token");
  localStorage.removeItem("vax_role");
  localStorage.removeItem("vax_user");
}
