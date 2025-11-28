import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { expensesService } from '@/services/expenses.service'
import type { Expense, CreateExpenseData } from '@/types'
import {
  Plus,
  Trash2,
  Search,
  Calendar,
  Filter,
  X
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const CATEGORIES = [
  { value: 'food', label: 'Alimentación', color: 'bg-orange-100 text-orange-700' },
  { value: 'transport', label: 'Transporte', color: 'bg-blue-100 text-blue-700' },
  { value: 'entertainment', label: 'Entretenimiento', color: 'bg-purple-100 text-purple-700' },
  { value: 'bills', label: 'Servicios', color: 'bg-red-100 text-red-700' },
  { value: 'shopping', label: 'Compras', color: 'bg-pink-100 text-pink-700' },
  { value: 'health', label: 'Salud', color: 'bg-green-100 text-green-700' },
  { value: 'other', label: 'Otro', color: 'bg-gray-100 text-gray-700' }
]

export function ExpensesPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(searchParams.get('new') === 'true')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  // Form state
  const [formData, setFormData] = useState<CreateExpenseData>({
    title: '',
    amount: 0,
    currency: user?.currency || 'USD',
    category: 'other',
    date: new Date().toISOString().slice(0, 10),
    note: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadExpenses()
  }, [selectedMonth])

  const loadExpenses = async () => {
    try {
      setLoading(true)
      const data = await expensesService.getExpenses(selectedMonth)
      setExpenses(data)
    } catch (error) {
      console.error('Error loading expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await expensesService.createExpense(formData)
      setFormData({
        title: '',
        amount: 0,
        currency: user?.currency || 'USD',
        category: 'other',
        date: new Date().toISOString().slice(0, 10),
        note: ''
      })
      setShowForm(false)
      setSearchParams({})
      loadExpenses()
    } catch (error) {
      console.error('Error creating expense:', error)
      alert('Error al crear el gasto')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return

    try {
      await expensesService.deleteExpense(id)
      loadExpenses()
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Error al eliminar el gasto')
    }
  }

  const getCategoryInfo = (category?: string) => {
    return CATEGORIES.find(c => c.value === category) || CATEGORIES[CATEGORIES.length - 1]
  }

  const filteredExpenses = expenses.filter(expense =>
    expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0)

  return (
    <Layout>
      <div className="min-h-full bg-gradient-to-br from-gray-50 to-blue-50 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Mis Gastos</h1>
            <p className="mt-2 text-gray-600">
              Gestiona y controla todos tus gastos
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {showForm ? (
              <>
                <X className="h-5 w-5" />
                Cancelar
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Nuevo Gasto
              </>
            )}
          </Button>
        </div>

        {/* New Expense Form */}
        {showForm && (
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Registrar nuevo gasto</CardTitle>
              <CardDescription>Completa los datos del gasto</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      placeholder="Ej: Almuerzo en restaurante"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Monto *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Nota (opcional)</Label>
                  <Input
                    id="note"
                    placeholder="Agrega detalles adicionales..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    {submitting ? 'Guardando...' : 'Guardar gasto'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setSearchParams({})
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters and Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-0 shadow-lg md:col-span-2">
            <CardContent className="flex gap-4 p-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar gastos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative w-48">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
            <CardContent className="p-6">
              <p className="text-sm font-medium opacity-90">Total gastado</p>
              <p className="mt-2 text-3xl font-bold">
                {user?.currency} {totalSpent.toFixed(2)}
              </p>
              <p className="mt-1 text-xs opacity-75">
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'gasto' : 'gastos'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Expenses List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Lista de gastos</CardTitle>
            <CardDescription>
              {selectedMonth && `Gastos de ${new Date(selectedMonth + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              </div>
            ) : filteredExpenses.length > 0 ? (
              <div className="space-y-2">
                {filteredExpenses.map((expense) => {
                  const categoryInfo = getCategoryInfo(expense.category)
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`rounded-lg px-3 py-1.5 text-sm font-medium ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{expense.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          {expense.note && (
                            <p className="mt-1 text-xs text-gray-400">{expense.note}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold text-gray-900">
                          -{expense.currency} {Number(expense.amount).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Filter className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">
                  {searchQuery ? 'No se encontraron gastos con ese criterio' : 'No hay gastos registrados este mes'}
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="mt-4"
                >
                  Agregar primer gasto
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
