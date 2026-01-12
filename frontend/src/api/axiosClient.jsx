import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:5000",
  timeout: 30000,
});


axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired or unauthorized. Redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
