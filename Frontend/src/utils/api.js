import axios from "axios";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "")
  .trim()
  .replace(/\/+$/, "");

export const apiClient = axios.create({
  baseURL: API_ORIGIN || undefined,
  withCredentials: true,
  validateStatus: () => true,
});

export const isOk = (res) => res.status >= 200 && res.status < 300;
