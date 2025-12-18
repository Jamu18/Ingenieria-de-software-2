import api from '@/lib/api'
import type { Expense, CreateExpenseData } from '@/types'

export const expensesService = {
  // Get all expenses (optionally filtered by month)
  async getExpenses(month?: string): Promise<Expense[]> {
    const params = month ? { month } : {}
    const response = await api.get<Expense[]>('/expenses', { params })
    return response.data
  },

  // Create new expense
  async createExpense(data: CreateExpenseData): Promise<Expense> {
    const response = await api.post<Expense>('/expenses', data)
    return response.data
  },

  // Delete expense
  async deleteExpense(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/expenses/${id}`)
    return response.data
  },
}
