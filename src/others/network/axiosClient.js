import axios from "axios";
import { useRouter } from "next/router";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to handle authorization headers
axiosClient.interceptors.request.use(
  (config) => {
    // Retrieve the JWT token from storage (e.g., localStorage, cookies)
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add an interceptor to handle unauthorized sessions
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const router = useRouter();
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear the stored token
      localStorage.removeItem("jwt");

      // Redirect the user to the login page
      router.push("/Login");

      return axiosClient(originalRequest);
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export const axiosExternalClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
