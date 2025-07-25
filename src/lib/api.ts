import axios from "axios";
import Cookies from "js-cookie";
import { handleUnauthorized } from "./auth-utils";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const accessToken = Cookies.get("access-token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config
},(error) => {
  return Promise.reject(error)
})

api.interceptors.response.use((response) => {
  return response
}, (error) => {
  const { response } = error
  if (response?.status === 401) {
    console.error("Unauthorized request, clearing auth and redirecting to login")
    handleUnauthorized();
  }
  return Promise.reject(error)
})

export default api