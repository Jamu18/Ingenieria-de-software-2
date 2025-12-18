// User types
export interface User {
  id: number
  email: string
  name: string
  currency: string
  monthly_salary?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  currency?: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Expense types
export interface Expense {
  id: number
  user_id: number
  title: string
  amount: number
  currency: string
  category?: string
  date: string
  note?: string
  created_at?: string
  updated_at?: string
}

export interface CreateExpenseData {
  title: string
  amount: number
  currency?: string
  category?: string
  date: string
  note?: string
}

// Savings Goal types
export interface SavingsGoal {
  id: number
  user_id: number
  name: string
  target_amount: number
  current_amount: number
  deadline?: string
  color: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateSavingsGoalData {
  name: string
  target_amount: number
  current_amount?: number
  deadline?: string
  color?: string
}

export interface UpdateSavingsGoalData {
  name?: string
  target_amount?: number
  current_amount?: number
  deadline?: string
  color?: string
}

// Context types
export interface AuthContextType {
  user: User | null
  token: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
  isAuthenticated: boolean
  isLoading: boolean
}
