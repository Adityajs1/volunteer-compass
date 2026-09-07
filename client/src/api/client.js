import axios from 'axios';

// The base URL depends on the environment
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle auth errors globally
apiClient.interceptors.response.use(
  (response) => response.data, // Strip the outer axios response wrapper
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout if token is expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('vc_page');
      // Use a custom event so the SPA page-state router handles navigation
      // (avoids a full-page reload that would break Vercel/SPA routing)
      window.dispatchEvent(new CustomEvent('vc:navigate', { detail: { page: 'login' } }));
    }
    // Return a unified error object
    return Promise.reject(
      error.response?.data || { success: false, message: 'An unexpected error occurred' }
    );
  }
);

export default apiClient;
