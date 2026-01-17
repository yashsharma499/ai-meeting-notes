import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
console.log("API URL 👉", API_URL);

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

/* ================= REQUEST INTERCEPTOR ================= */
axiosClient.interceptors.request.use(
  (config) => {
    // Skip auth routes
    if (
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/signup")
    ) {
      return config;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return config;

    try {
      const { exp } = jwtDecode(token);

      // Token expired → logout
      if (Date.now() >= exp * 1000) {
        console.warn("Access token expired");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject("TOKEN_EXPIRED");
      }

      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject("INVALID_TOKEN");
    }
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // 🚫 Ignore auth routes completely
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/signup")
    ) {
      return Promise.reject(error);
    }

    // ❗ DO NOT auto-logout on every 401
    // Just log it (most 401s are normal on first load)
    if (status === 401) {
      console.warn("401 Unauthorized from:", url);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
