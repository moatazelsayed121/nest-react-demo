import axios from "axios";

const axionsInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 1000,
  withCredentials: true,
});

export default axionsInstance;
