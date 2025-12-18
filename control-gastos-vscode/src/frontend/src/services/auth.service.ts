import api from '@/lib/api'
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types'

export const authService = {
  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  // Get current user
  async getCurrentUser(): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>('/auth/me')
    return response.data
  },

  // Update user settings
  async updateSettings(data: { monthly_salary?: number; currency?: string }): Promise<{ user: User }> {
    const response = await api.put<{ user: User }>('/auth/settings', data)
    return response.data
  },

  // Update user profile (name, email)
  async updateProfile(data: { name?: string; email?: string }): Promise<{ user: User }> {
    const response = await api.put<{ user: User }>('/auth/profile', data)
    return response.data
  },

  // Change password
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/auth/password', data)
    return response.data
  },

  // Logout (client-side only)
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}
