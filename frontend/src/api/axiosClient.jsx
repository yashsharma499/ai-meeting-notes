import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";


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
        
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject("TOKEN_EXPIRED");
      }

      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (err) {
      
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject("INVALID_TOKEN");
    }
  },
  (error) => Promise.reject(error)
);


axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/signup")
    ) {
      return Promise.reject(error);
    }

    
    if (status === 401) {
      
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
