import axios from "axios";
import { BASE_API_URL } from "./apiConfig";

const apiService = {
  get: (endpoint: string, config = {}) => axios.get(`${BASE_API_URL}${endpoint}`, { ...config, withCredentials: true }),
  post: (endpoint: string, data: any, config = {}) => axios.post(`${BASE_API_URL}${endpoint}`, data, { ...config, withCredentials: true }),
  delete: (endpoint: string, config = {}) => axios.delete(`${BASE_API_URL}${endpoint}`, { ...config, withCredentials: true }),
  put: (endpoint: string, data: any, config = {}) => axios.put(`${BASE_API_URL}${endpoint}`, data, { ...config, withCredentials: true }),
};

export default apiService;
