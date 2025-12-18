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
  ArrowRight,
  PieChart as PieChartIcon
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

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

  // Calcular gastos por categoría
  const categoryData = expenses.reduce((acc, exp) => {
    const category = exp.category || 'other'
    if (!acc[category]) {
      acc[category] = { name: category, value: 0 }
    }
    acc[category].value += Number(exp.amount)
    return acc
  }, {} as Record<string, { name: string; value: number }>)

  const pieChartData = Object.values(categoryData).map((item) => ({
    name: getCategoryLabel(item.name),
    value: Number(item.value.toFixed(2))
  }))

  // Calcular gastos de últimos 7 días
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const dailyExpenses = last7Days.map(date => {
    const dayExpenses = expenses.filter(exp => exp.date === date)
    const total = dayExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0)
    const dayName = new Date(date).toLocaleDateString('es-ES', { weekday: 'short' })
    return {
      day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      amount: Number(total.toFixed(2))
    }
  })

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#6b7280']

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

  function getCategoryLabel(category: string) {
    const labels: Record<string, string> = {
      food: 'Comida',
      transport: 'Transporte',
      entertainment: 'Entretenimiento',
      bills: 'Facturas',
      shopping: 'Compras',
      health: 'Salud',
      other: 'Otros'
    }
    return labels[category] || category
  }

  return (
    <Layout>
      <div className="min-h-full bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Bienvenido, {user?.name}! 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Aquí tienes un resumen de tus finanzas del mes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Sueldo mensual */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs sm:text-sm">Sueldo mensual</CardDescription>
                <div className="rounded-full bg-blue-100 p-1.5 sm:p-2">
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl truncate">
                {user?.currency} {Number(user?.monthly_salary || 0).toFixed(0)}
              </CardTitle>
            </CardContent>
          </Card>

          {/* Total gastado */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs sm:text-sm">Total gastado</CardDescription>
                <div className="rounded-full bg-red-100 p-1.5 sm:p-2">
                  <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-red-600 truncate">
                {user?.currency} {totalSpent.toFixed(0)}
              </CardTitle>
              <p className="mt-1 text-xs text-gray-500">
                {expenseCount} {expenseCount === 1 ? 'gasto' : 'gastos'}
              </p>
            </CardContent>
          </Card>

          {/* Disponible */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs sm:text-sm">Disponible</CardDescription>
                <div className="rounded-full bg-green-100 p-1.5 sm:p-2">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-green-600 truncate">
                {user?.currency} {available.toFixed(0)}
              </CardTitle>
              <p className="mt-1 text-xs text-gray-500">
                {((available / (Number(user?.monthly_salary) || 1)) * 100).toFixed(0)}% restante
              </p>
            </CardContent>
          </Card>

          {/* Promedio diario */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs sm:text-sm">Promedio diario</CardDescription>
                <div className="rounded-full bg-purple-100 p-1.5 sm:p-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-purple-600 truncate">
                {user?.currency} {(totalSpent / new Date().getDate()).toFixed(0)}
              </CardTitle>
              <p className="mt-1 text-xs text-gray-500">Gasto por día</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        {expenses.length > 0 && (
          <div className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Gastos por categoría */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg sm:text-xl">Gastos por categoría</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">Distribución de tus gastos este mes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${user?.currency} ${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tendencia últimos 7 días */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg sm:text-xl">Últimos 7 días</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">Tendencia de tus gastos diarios</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyExpenses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => `${user?.currency} ${value.toFixed(2)}`} />
                    <Bar dataKey="amount" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Recent Expenses */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Gastos recientes</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Tus últimos 5 gastos registrados</CardDescription>
                </div>
                <Link to="/expenses">
                  <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                    <span className="hidden sm:inline">Ver todos</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
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
                <div className="space-y-2 sm:space-y-3">
                  {recentExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between rounded-lg border bg-white p-2 sm:p-3 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className={`rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-medium ${getCategoryColor(expense.category)} whitespace-nowrap`}>
                          {getCategoryLabel(expense.category || 'other')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{expense.title}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">{new Date(expense.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base ml-2 whitespace-nowrap">
                        -{expense.currency} {Number(expense.amount).toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 sm:py-12 text-center">
                  <CreditCard className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                  <p className="mt-4 text-xs sm:text-sm text-gray-500">No hay gastos registrados este mes</p>
                  <Link to="/expenses">
                    <Button className="mt-4 text-xs sm:text-sm">Agregar tu primer gasto</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Acciones rápidas</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Gestiona tus finanzas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <Link to="/expenses?new=true">
                <Button className="w-full justify-start gap-2 sm:gap-3 h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                  <div className="text-left">
                    <div className="font-semibold text-xs sm:text-sm">Registrar nuevo gasto</div>
                    <div className="text-[10px] sm:text-xs opacity-90">Añade un gasto rápidamente</div>
                  </div>
                </Button>
              </Link>

              <Link to="/savings">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 sm:gap-3 h-12 sm:h-14 border-2"
                >
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  <div className="text-left">
                    <div className="font-semibold text-xs sm:text-sm">Ver metas de ahorro</div>
                    <div className="text-[10px] sm:text-xs text-gray-500">Revisa tu progreso</div>
                  </div>
                </Button>
              </Link>

              <Link to="/settings">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 sm:gap-3 h-12 sm:h-14 border-2"
                >
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
                  <div className="text-left">
                    <div className="font-semibold text-xs sm:text-sm">Configurar sueldo</div>
                    <div className="text-[10px] sm:text-xs text-gray-500">Actualiza tu sueldo mensual</div>
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
