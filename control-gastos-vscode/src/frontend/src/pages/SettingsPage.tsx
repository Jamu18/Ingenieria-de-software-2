import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Wallet, DollarSign, Mail, Settings as SettingsIcon } from 'lucide-react'

export function SettingsPage() {
  const { user } = useAuth()
  const [monthlySalary, setMonthlySalary] = useState(user?.monthly_salary ? String(user.monthly_salary) : '')
  const [saving, setSaving] = useState(false)

  const handleSaveSalary = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Simulate API call
    setTimeout(() => {
      alert('Funcionalidad de actualización en desarrollo')
      setSaving(false)
    }, 1000)
  }

  return (
    <Layout>
      <div className="min-h-full bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tu perfil y preferencias
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Profile Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-2">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Tus datos de perfil</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Nombre completo</Label>
                <div className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">{user?.name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Correo electrónico</Label>
                <div className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">{user?.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Moneda</Label>
                <div className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">{user?.currency}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full" disabled>
                  Editar perfil (Próximamente)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Salary */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-2">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Sueldo Mensual</CardTitle>
                  <CardDescription>Configura tu ingreso mensual</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSalary} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">Sueldo mensual ({user?.currency})</Label>
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-500">
                    Este valor se usará para calcular tus estadísticas y disponible mensual
                  </p>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Consejo:</strong> Actualiza tu sueldo cada vez que haya cambios
                    para mantener tus estadísticas precisas.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="border-0 shadow-lg lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-600 p-2">
                  <SettingsIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Preferencias</CardTitle>
                  <CardDescription>Personaliza tu experiencia</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold text-gray-900">Notificaciones</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Configura alertas de gastos y límites (Próximamente)
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold text-gray-900">Categorías personalizadas</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Crea tus propias categorías de gastos (Próximamente)
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold text-gray-900">Reportes</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Exporta tus datos a PDF o Excel (Próximamente)
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold text-gray-900">Tema oscuro</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Activa el modo oscuro para cuidar tus ojos (Próximamente)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
