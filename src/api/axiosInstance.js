import axios from "axios";
import Base_URL from "../../config";

const axiosInstance = axios.create({
  baseURL: Base_URL,
});

axiosInstance.interceptors.request.use((config) => {

  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(
          `${Base_URL}token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccess = res.data.access;

        localStorage.setItem("accessToken", newAccess);

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${newAccess}`;

        originalRequest.headers["Authorization"] =
          `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);

      } catch (err) {

        localStorage.clear();
        window.location.href = "/login";

      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;