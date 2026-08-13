import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use(
  (config) => {
    // Customer login
    const customerUser =
      localStorage.getItem("customerUserInfo") ||
      sessionStorage.getItem("customerUserInfo");

    // Admin login
    const adminUser =
      localStorage.getItem("userInfo") ||
      sessionStorage.getItem("userInfo");

    // Customer token has priority for customer requests
    const storedUser = customerUser || adminUser;

    if (storedUser) {
      try {
        const { token } = JSON.parse(storedUser);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Invalid stored user data:", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;