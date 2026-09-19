import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getStoredToken, removeStoredToken, removeStoredUser } from '../utils/storage';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      // Only clear storage if it's not a normal credential-based login rejection
      if (!url.includes('/auth/login') && !url.includes('/auth/google')) {
        removeStoredToken();
        removeStoredUser();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

