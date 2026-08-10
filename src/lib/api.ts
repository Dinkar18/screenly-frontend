import axios from 'axios';
import axiosRetry from 'axios-retry';
import { API_BASE_URL } from './endpoints';

// Create a configured axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure robust exponential backoff retries for network resilience
axiosRetry(api, { 
  retries: 3, 
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 500;
  }
});

// Response interceptor to handle global errors (e.g., 401 Unauthorized, 500 Internal Server Error)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (status === 500) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('global-toast', {
            detail: {
              message: 'An internal server error occurred. Please try again later.',
              type: 'error',
            },
          })
        );
      }
    }

    return Promise.reject(error);
  }
);
