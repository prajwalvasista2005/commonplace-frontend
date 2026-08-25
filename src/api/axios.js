import axios from 'axios';

// Reads from Vite env (.env / .env.production) so the backend URL isn't
// hardcoded and baked into the bundle - falls back to the current deployed
// backend if the env var isn't set.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://social-media-u3ph.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/login') ||
      originalRequest.url?.includes('/refresh')
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/refresh`,
        { refresh_token: refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      localStorage.setItem('access_token', data.access_token);
      processQueue(null, data.access_token);
      originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const detail = error.response?.data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((item) => item.msg).join('. ');
  }

  if (error.message === 'Network Error') {
    return 'Unable to reach the server. Check your connection.';
  }

  return fallback;
};

export default api;
