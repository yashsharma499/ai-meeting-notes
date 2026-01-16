import axios from "axios";
import jwtDecode from "jwt-decode";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000",
  timeout: 30000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
      
        const { exp } = jwtDecode(token);

        if (Date.now() >= exp * 1000) {
          console.warn("Token expired. Logging out...");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return Promise.reject("Token expired");
        }

        
        config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        console.error("Invalid JWT format", err);
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject("Invalid token");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);


axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired or unauthorized (401). Redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
