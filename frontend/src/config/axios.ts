import axios from "axios";

const api = axios.create({
  //for local development
  // baseURL: "http://localhost:8000/api",

  //for production
  baseURL: "https://final.ahasanhabibroxy.online/api",
  withCredentials: true,
  
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default api;