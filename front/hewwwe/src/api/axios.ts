import axios from 'axios';

/**
 * Axios instance for API requests
 */
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

/**
 * Intercepts responses to handle unauthorized access
 */
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.log('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
