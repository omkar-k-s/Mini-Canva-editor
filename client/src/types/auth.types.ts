// ─── Auth Types ──────────────────────────────────────────────────────────────

export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// ─── Auth Store State ─────────────────────────────────────────────────────────

export interface AuthStoreState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  initialize: () => void
}
