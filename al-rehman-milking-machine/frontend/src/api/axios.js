import axios from "axios";

// In local dev, VITE_API_URL is unset, so this falls back to "/api"
// which Vite's dev proxy forwards to your local backend.
// On Vercel, set VITE_API_URL to your deployed backend's URL
// (e.g. https://al-rahman-backend.onrender.com/api).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;