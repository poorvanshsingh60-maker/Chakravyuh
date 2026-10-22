import axios from 'axios';

const getBaseUrl = () => {
  try {
    return (import.meta as any).env?.VITE_API_URL || '/api/v1';
  } catch {
    return '/api/v1';
  }
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chakravyuh_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem('chakravyuh_access_token');
    }
    return Promise.reject(error);
  }
);

export default api;
