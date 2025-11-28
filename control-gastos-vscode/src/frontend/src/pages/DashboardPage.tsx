import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { expensesService } from '@/services/expenses.service'
import type { Expense } from '@/types'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Calendar,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function DashboardPage() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7)
      const data = await expensesService.getExpenses(currentMonth)
      setExpenses(data)
    } catch (error) {
      console.error('Error loading expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0)
  const available = Number(user?.monthly_salary || 0) - totalSpent
  const expenseCount = expenses.length

  const recentExpenses = expenses.slice(0, 5)

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      food: 'bg-orange-100 text-orange-700',
      transport: 'bg-blue-100 text-blue-700',
      entertainment: 'bg-purple-100 text-purple-700',
      bills: 'bg-red-100 text-red-700',
      shopping: 'bg-pink-100 text-pink-700',
      health: 'bg-green-100 text-green-700',
      other: 'bg-gray-100 text-gray-700'
    }
    return colors[category || 'other'] || colors.other
  }

  return (
    <Layout>
      <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Bienvenido, {user?.name}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Aquí tienes un resumen de tus finanzas del mes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Sueldo mensual */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Sueldo mensual</CardDescription>
                <div className="rounded-full bg-blue-100 p-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl">
                {user?.currency} {Number(user?.monthly_salary || 0).toFixed(2)}
              </CardTitle>
            </CardContent>
          </Card>

          {/* Total gastado */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total gastado</CardDescription>
                <div className="rounded-full bg-red-100 p-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-red-600">
                {user?.currency} {totalSpent.toFixed(2)}
              </CardTitle>
              <p className="mt-1 text-xs text-gray-500">
                {expenseCount} {expenseCount === 1 ? 'gasto' : 'gastos'} este mes
              </p>
            </CardContent>
          </Card>

          {/* Disponible */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Disponible</CardDescription>
                <div className="rounded-full bg-green-100 p-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-green-600">
                {user?.currency} {available.toFixed(2)}
              </CardTitle>
              <p className="mt-1 text-xs text-gray-500">
                {((available / (Number(user?.monthly_salary) || 1)) * 100).toFixed(1)}% restante
              </p>
            </CardContent>
          </Card>

          {/* Promedio diario */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Promedio diario</CardDescription>
                <div className="rounded-full bg-purple-100 p-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-purple-600">
                {user?.currency} {(totalSpent / new Date().getDate()).toFixed(2)}
              </CardTitle>
              <p className="mt-1 text-xs text-gray-500">Gasto promedio por día</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Expenses */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gastos recientes</CardTitle>
                  <CardDescription>Tus últimos 5 gastos registrados</CardDescription>
                </div>
                <Link to="/expenses">
                  <Button variant="ghost" size="sm" className="gap-2">
                    Ver todos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
              ) : recentExpenses.length > 0 ? (
                <div className="space-y-3">
                  {recentExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between rounded-lg border bg-white p-3 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg px-2 py-1 text-xs font-medium ${getCategoryColor(expense.category)}`}>
                          {expense.category || 'Sin categoría'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{expense.title}</p>
                          <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString('es-ES')}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        -{expense.currency} {Number(expense.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-sm text-gray-500">No hay gastos registrados este mes</p>
                  <Link to="/expenses">
                    <Button className="mt-4">Agregar tu primer gasto</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Acciones rápidas</CardTitle>
              <CardDescription>Gestiona tus finanzas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/expenses?new=true">
                <Button className="w-full justify-start gap-3 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <CreditCard className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Registrar nuevo gasto</div>
                    <div className="text-xs opacity-90">Añade un gasto rápidamente</div>
                  </div>
                </Button>
              </Link>

              <Link to="/savings">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-14 border-2"
                >
                  <TrendingUp className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Ver metas de ahorro</div>
                    <div className="text-xs text-gray-500">Revisa tu progreso</div>
                  </div>
                </Button>
              </Link>

              <Link to="/settings">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-14 border-2"
                >
                  <Wallet className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Configurar sueldo</div>
                    <div className="text-xs text-gray-500">Actualiza tu sueldo mensual</div>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
