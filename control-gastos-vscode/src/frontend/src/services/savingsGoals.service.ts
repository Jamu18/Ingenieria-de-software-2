import api from '@/lib/api'
import type { SavingsGoal, CreateSavingsGoalData, UpdateSavingsGoalData } from '@/types'

export const savingsGoalsService = {
  // Get all savings goals
  async getSavingsGoals(): Promise<SavingsGoal[]> {
    const response = await api.get<SavingsGoal[]>('/savings-goals')
    return response.data
  },

  // Create savings goal
  async createSavingsGoal(data: CreateSavingsGoalData): Promise<SavingsGoal> {
    const response = await api.post<SavingsGoal>('/savings-goals', data)
    return response.data
  },

  // Update savings goal
  async updateSavingsGoal(id: number, data: UpdateSavingsGoalData): Promise<SavingsGoal> {
    const response = await api.put<SavingsGoal>(`/savings-goals/${id}`, data)
    return response.data
  },

  // Delete savings goal
  async deleteSavingsGoal(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/savings-goals/${id}`)
    return response.data
  },
}
