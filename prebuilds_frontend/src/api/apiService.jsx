import axios from "axios";
import { BASE_API_URL } from "./apiConfig";

const apiService = {
  get: (endpoint, config = {}) =>
    axios.get(`${BASE_API_URL}${endpoint}`, { ...config, withCredentials: true }),
  post: (endpoint, data, config = {}) =>
    axios.post(`${BASE_API_URL}${endpoint}`, data, { ...config, withCredentials: true }),
  delete: (endpoint, config = {}) =>
    axios.delete(`${BASE_API_URL}${endpoint}`, { ...config, withCredentials: true }),
  put: (endpoint, data, config = {}) =>
    axios.put(`${BASE_API_URL}${endpoint}`, data, { ...config, withCredentials: true }),
};

export default apiService;
