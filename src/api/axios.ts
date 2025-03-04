import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const baseURL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });
        
        const { user, accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Update auth store with new tokens
        useAuthStore.getState().setAuth(user, accessToken, newRefreshToken);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout user
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;