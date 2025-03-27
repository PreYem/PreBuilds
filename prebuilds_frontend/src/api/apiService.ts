import axios, { AxiosRequestConfig } from "axios";
import { BASE_API_URL } from "./apiConfig";

interface RequestConfig extends Omit<AxiosRequestConfig, "headers"> {
  headers?: Record<string, string>;
}

const apiService = {
  // Function to get CSRF cookie before making requests
  async initializeCsrfProtection() {
    try {
      await axios.get(`${BASE_API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Failed to retrieve CSRF cookie:', error);
    }
  },

  // Helper function to get XSRF token
  getXsrfToken(): string {
    const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
    return csrfCookie 
      ? decodeURIComponent(csrfCookie.split('=')[1]) 
      : '';
  },

  get: (endpoint: string, config: RequestConfig = {}) => {
    const token = localStorage.getItem("prebuilds_auth_token");
    return axios.get(`${BASE_API_URL}${endpoint}`, {
      ...config,
      withCredentials: true,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type" : "multipart/form-data",
        Accept: "application/json",
      },
    });
  },

  post: (endpoint: string, data: any, config: RequestConfig = {}) => {
    const token = localStorage.getItem("prebuilds_auth_token");
    const xsrfToken = apiService.getXsrfToken();
    
    return axios.post(`${BASE_API_URL}${endpoint}`, data, {
      ...config,
      withCredentials: true,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type" : "multipart/form-data",
        Accept: "application/json",
        // Add XSRF token header
        "X-XSRF-TOKEN": xsrfToken,
      },
    });
  },

  delete: (endpoint: string, config: RequestConfig = {}) => {
    const token = localStorage.getItem("prebuilds_auth_token");
    const xsrfToken = apiService.getXsrfToken();
    
    return axios.delete(`${BASE_API_URL}${endpoint}`, {
      ...config,
      withCredentials: true,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type" : "multipart/form-data",
        Accept: "application/json",
        // Add XSRF token header
        "X-XSRF-TOKEN": xsrfToken,
      },
    });
  },

  put: (endpoint: string, data: any, config: RequestConfig = {}) => {
    const token = localStorage.getItem("prebuilds_auth_token");
    const xsrfToken = apiService.getXsrfToken();
    
    return axios.put(`${BASE_API_URL}${endpoint}`, data, {
      ...config,
      withCredentials: true,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type" : "application/json",
        Accept: "application/json",
        // Add XSRF token header
        "X-XSRF-TOKEN": xsrfToken,
      },
    });
  },
};

// Initialize CSRF protection when the module is imported
apiService.initializeCsrfProtection();

export default apiService;