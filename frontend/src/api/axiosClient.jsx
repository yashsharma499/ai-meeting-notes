import axios from "axios";
import jwtDecode from "jwt-decode";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000",
  timeout: 30000,
});

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) return null;

  try {
    const decoded = jwtDecode(refreshToken);

    if (Date.now() >= decoded.exp * 1000) {
      console.warn("Refresh token expired, logging out...");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      return null;
    }

    const res = await axios.post(
      "/auth/refresh",
      {},
      {
        baseURL: import.meta.env.VITE_API_URL,
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );

    const newAccessToken = res.data.access_token;

    localStorage.setItem("access_token", newAccessToken);

    return newAccessToken;
  } catch (err) {
    console.error("Refresh token invalid", err);
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
    window.location.href = "/login";
    return null;
  }
};

axiosClient.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      try {
        const { exp } = jwtDecode(accessToken);

        // If access token expired → refresh it
        if (Date.now() >= exp * 1000) {
          console.warn("Access token expired → refreshing...");

          accessToken = await refreshAccessToken();

          if (!accessToken) return Promise.reject("Unable to refresh access token");
        }

        // Attach valid or newly refreshed token
        config.headers.Authorization = `Bearer ${accessToken}`;
      } catch (err) {
        console.error("Invalid access token", err);
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject("Invalid access token");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If backend returns 401, try refreshing token again
    if (error.response?.status === 401) {
      console.warn("Received 401 → Attempting refresh");

      const newAccess = await refreshAccessToken();

      if (newAccess) {
        // Retry original request with new access token
        error.config.headers.Authorization = `Bearer ${newAccess}`;
        return axiosClient(error.config);
      }

      // If refresh fails → logout
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
