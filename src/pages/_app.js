import { useEffect } from "react";
import RootLayout from "./layout";
import "./globals.css";
import { useRouter } from "next/router";
import axiosClient from "../others/network/axiosClient";

import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Add an interceptor to handle unauthorized sessions
    const requestInterceptor = axiosClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("jwt");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401 && !error.config._retry) {
          error.config._retry = true;
          localStorage.removeItem("jwt");
          router.push("/Login");

          return axiosClient(error.config);
        }

        // Handle other errors
        return Promise.reject(error);
      }
    );

    // Clean up the interceptors when the component is unmounted
    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor);
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}
