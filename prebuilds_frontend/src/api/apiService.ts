import axios, { AxiosRequestConfig } from "axios";
import { BASE_API_URL } from "./apiConfig";



interface RequestConfig extends Omit<AxiosRequestConfig, 'headers'> {
  headers?: Record<string, string>;
}

const apiService = {
  get: (endpoint: string, config: RequestConfig  = {}) => {
    const token = localStorage.getItem("prebuilds_auth_token");
    return axios.get(`${BASE_API_URL}${endpoint}`, { 
      ...config, 
      withCredentials: true,
      headers: {
        ...config.headers,
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
  },
  
  post: (endpoint: string, data: any, config: RequestConfig  = {}) => {
    const token = localStorage.getItem("prebuilds_auth_token");
    return axios.post(`${BASE_API_URL}${endpoint}`, data, { 
      ...config, 
      withCredentials: true,
      headers: {
        ...config.headers,
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
  },
  
  delete: (endpoint: string, config: RequestConfig  = {}) => {
    const token = localStorage.getItem("prebuilds_auth_token");
    return axios.delete(`${BASE_API_URL}${endpoint}`, { 
      ...config, 
      withCredentials: true,
      headers: {
        ...(config.headers ),
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
  },
  
  put: (endpoint: string, data: any, config: RequestConfig  = {}) => {
    const token = localStorage.getItem("prebuilds_auth_token");
    return axios.put(`${BASE_API_URL}${endpoint}`, data, { 
      ...config, 
      withCredentials: true,
      headers: {
        ...config.headers,
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
  },
};

export default apiService;



// RewriteEngine On

// # Ensure that the requested file or directory doesn't exist before redirecting to index.html
// RewriteCond %{REQUEST_FILENAME} !-f
// RewriteCond %{REQUEST_FILENAME} !-d

// # Redirect all requests to index.html to handle routing with React
// RewriteRule ^ index.html [QSA,L]
