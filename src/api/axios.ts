import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    const message = error.response?.data?.message;
    const errorMsg = Array.isArray(message) ? message.join(', ') : message || 'An unexpected error occurred';
    toast.error(errorMsg);
    return Promise.reject(error);
  }
);

export default api;
