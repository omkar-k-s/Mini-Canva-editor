import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthStoreState, User } from '@/types/auth.types'

/**
 * Auth store — persists token to localStorage.
 * Uses Zustand's persist middleware so auth survives page refresh.
 */
export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      setToken: (token) =>
        set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('mini-canva-auth')
      },

      initialize: () => {
        const { token } = get()
        if (token) {
          set({ isAuthenticated: true, isLoading: false })
        } else {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'mini-canva-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
)

// Selectors
export const selectUser            = (s: AuthStoreState) => s.user
export const selectToken           = (s: AuthStoreState) => s.token
export const selectIsAuthenticated = (s: AuthStoreState) => s.isAuthenticated
export const selectIsLoading       = (s: AuthStoreState) => s.isLoading
