import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { savingsGoalsService } from '@/services/savingsGoals.service'
import type { SavingsGoal, CreateSavingsGoalData } from '@/types'
import { Plus, Target, TrendingUp, Calendar, Trash2, Edit, X, Check } from 'lucide-react'

const COLORS = [
  { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
  { value: 'green', label: 'Verde', class: 'bg-green-500' },
  { value: 'purple', label: 'Púrpura', class: 'bg-purple-500' },
  { value: 'pink', label: 'Rosa', class: 'bg-pink-500' },
  { value: 'orange', label: 'Naranja', class: 'bg-orange-500' },
  { value: 'indigo', label: 'Índigo', class: 'bg-indigo-500' },
]

export function SavingsPage() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  // Form state
  const [formData, setFormData] = useState<CreateSavingsGoalData>({
    name: '',
    target_amount: 0,
    current_amount: 0,
    deadline: '',
    color: 'blue'
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      setLoading(true)
      const data = await savingsGoalsService.getSavingsGoals()
      setGoals(data)
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingId) {
        await savingsGoalsService.updateSavingsGoal(editingId, formData)
      } else {
        await savingsGoalsService.createSavingsGoal(formData)
      }

      resetForm()
      loadGoals()
    } catch (error) {
      console.error('Error saving goal:', error)
      alert('Error al guardar la meta')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (goal: SavingsGoal) => {
    setFormData({
      name: goal.name,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      deadline: goal.deadline || '',
      color: goal.color
    })
    setEditingId(goal.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta meta?')) return

    try {
      await savingsGoalsService.deleteSavingsGoal(id)
      loadGoals()
    } catch (error) {
      console.error('Error deleting goal:', error)
      alert('Error al eliminar la meta')
    }
  }

  const handleAddSavings = async (goalId: number, amount: number) => {
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return

    const newAmount = Number(goal.current_amount) + amount

    if (newAmount < 0) {
      alert('El monto no puede ser negativo')
      return
    }

    if (newAmount > goal.target_amount) {
      if (!confirm('El monto supera la meta. ¿Deseas continuar?')) return
    }

    try {
      await savingsGoalsService.updateSavingsGoal(goalId, {
        current_amount: newAmount
      })
      loadGoals()
    } catch (error) {
      console.error('Error updating goal:', error)
      alert('Error al actualizar el ahorro')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      target_amount: 0,
      current_amount: 0,
      deadline: '',
      color: 'blue'
    })
    setEditingId(null)
    setShowForm(false)
  }

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      pink: 'from-pink-500 to-pink-600',
      orange: 'from-orange-500 to-orange-600',
      indigo: 'from-indigo-500 to-indigo-600',
    }
    return colorMap[color] || colorMap.blue
  }

  const calculateProgress = (current: number | string, target: number | string) => {
    const curr = Number(current)
    const targ = Number(target)
    if (targ === 0) return 0
    return Math.min((curr / targ) * 100, 100)
  }

  const totalSaved = goals.reduce((sum, goal) => sum + Number(goal.current_amount || 0), 0)
  const totalTarget = goals.reduce((sum, goal) => sum + Number(goal.target_amount || 0), 0)

  return (
    <Layout>
      <div className="min-h-full bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Metas de Ahorro</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Establece y alcanza tus objetivos financieros
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 w-full sm:w-auto"
          >
            {showForm ? (
              <>
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                Cancelar
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                Nueva Meta
              </>
            )}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 sm:mb-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-2 sm:p-3">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Metas Activas</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{goals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-2 sm:p-3">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total Ahorrado</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                    {user?.currency} {totalSaved.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-600 p-2 sm:p-3">
                  <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Progreso Total</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <Card className="mb-6 sm:mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">{editingId ? 'Editar Meta' : 'Nueva Meta de Ahorro'}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {editingId ? 'Modifica los datos de tu meta' : 'Define tu objetivo financiero'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm">Nombre de la meta</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ej: Vacaciones, Auto nuevo..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target" className="text-xs sm:text-sm">Monto objetivo ({user?.currency})</Label>
                    <Input
                      id="target"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.target_amount || ''}
                      onChange={(e) => setFormData({ ...formData, target_amount: parseFloat(e.target.value) || 0 })}
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current" className="text-xs sm:text-sm">Monto actual ({user?.currency})</Label>
                    <Input
                      id="current"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.current_amount || ''}
                      onChange={(e) => setFormData({ ...formData, current_amount: parseFloat(e.target.value) || 0 })}
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-xs sm:text-sm">Fecha límite (opcional)</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full ${color.class} transition-transform ${
                          formData.color === color.value ? 'scale-110 ring-4 ring-gray-300' : 'hover:scale-105'
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs sm:text-sm"
                  >
                    {submitting ? 'Guardando...' : editingId ? 'Actualizar Meta' : 'Crear Meta'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="text-xs sm:text-sm"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Goals List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-sm sm:text-base text-gray-600">Cargando metas...</p>
          </div>
        ) : goals.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-8 sm:py-12 text-center">
              <Target className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
              <h3 className="mt-4 text-base sm:text-lg font-semibold text-gray-900">No tienes metas de ahorro</h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Crea tu primera meta y comienza a alcanzar tus objetivos financieros
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs sm:text-sm w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Crear Primera Meta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.current_amount, goal.target_amount)
              const remaining = Number(goal.target_amount) - Number(goal.current_amount)
              const isCompleted = progress >= 100

              return (
                <Card key={goal.id} className="border-0 shadow-lg overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${getColorClass(goal.color)}`} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{goal.name}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          {goal.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">
                          {user?.currency} {Number(goal.current_amount).toFixed(2)}
                        </span>
                        <span className="font-medium text-gray-700">
                          {user?.currency} {Number(goal.target_amount).toFixed(2)}
                        </span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getColorClass(goal.color)} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                          {progress.toFixed(1)}% completado
                        </span>
                        {!isCompleted && (
                          <span className="text-gray-600">
                            Faltan {user?.currency} {remaining.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add/Remove Savings */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const amount = prompt('¿Cuánto deseas agregar?')
                          if (amount) handleAddSavings(goal.id, parseFloat(amount))
                        }}
                        className="flex-1"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const amount = prompt('¿Cuánto deseas retirar?')
                          if (amount) handleAddSavings(goal.id, -parseFloat(amount))
                        }}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Retirar
                      </Button>
                    </div>

                    {isCompleted && (
                      <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                        <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          ¡Meta completada! 🎉
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
