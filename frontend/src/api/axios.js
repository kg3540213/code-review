import axios from 'axios';

// Dev: use relative /api (Vite proxies to backend). Prod: set VITE_API_URL to backend URL including /api (e.g. https://api.example.com/api)
const envUrl = import.meta.env.VITE_API_URL || '';
const baseURL = envUrl
  ? (envUrl.endsWith('/api') ? envUrl : envUrl.replace(/\/$/, '') + '/api')
  : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage if present (for non-cookie fallback)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear token only. Do NOT redirect here — so home page loads for guests.
// ProtectedRoute redirects to /login when an unauthenticated user visits /dashboard or /review.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(err);
  }
);

export default api;
