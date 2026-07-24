import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

/**
 * Axios instance with:
 * - Base URL from env
 * - Automatic JWT injection via request interceptor
 * - 401 auto-logout via response interceptor
 */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor — inject token ───────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor — handle 401 ───────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config
    // Don't intercept 401s for login/register requests
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.url?.includes('/auth/')
    ) {
      useAuthStore.getState().logout()
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export default api
