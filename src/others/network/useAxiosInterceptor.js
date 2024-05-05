import { useRouter } from 'next/router';
import axiosClient from './axiosClient';

const useAxiosInterceptor = () => {
    const router = useRouter();

    // Add an interceptor to handle unauthorized sessions
    axiosClient.interceptors.response.use(
        (response) => response,
        (error) => {
            const originalRequest = error.config;

            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                // Clear the stored token
                localStorage.removeItem('jwt');

                // Redirect the user to the login page
                router.push('/Login');

                return axiosClient(originalRequest);
            }

            // Handle other errors
            return Promise.reject(error);
        }
    );

    return axiosClient;
};

export default useAxiosInterceptor;