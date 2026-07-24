import api from './api'
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/auth.types'

/**
 * Auth API service — all calls to /api/auth/*
 */
export const authService = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<{ data: AuthResponse }>('/auth/register', credentials)
    return data.data
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<{ data: AuthResponse }>('/auth/login', credentials)
    return data.data
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get<{ data: { user: User } }>('/auth/profile')
    return data.data.user
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },
}
