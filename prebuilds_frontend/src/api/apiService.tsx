import axios, { AxiosRequestConfig } from "axios";
import { BASE_API_URL } from "./apiConfig";

const apiService = {
  get: (endpoint: string, config: AxiosRequestConfig = {}) =>
    axios.get(BASE_API_URL + endpoint, {
      ...config,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    }),
  post: (endpoint: string, data: any, config = {}) =>
    axios.post(BASE_API_URL + endpoint, data, {
      ...config,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    }),
  delete: (endpoint: string, config: AxiosRequestConfig = {}) =>
    axios.delete(BASE_API_URL + endpoint, {
      ...config,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    }),
  put: (endpoint: string, data: any, config = {}) =>
    axios.put(BASE_API_URL + endpoint, data, {
      ...config,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    }),
};

export default apiService;
