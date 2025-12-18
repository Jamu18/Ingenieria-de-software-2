import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Wallet, DollarSign, Mail, Settings as SettingsIcon, Lock, Edit } from 'lucide-react'
import { authService } from '@/services/auth.service'

export function SettingsPage() {
  const { user, updateUser } = useAuth()

  // Monthly salary state
  const [monthlySalary, setMonthlySalary] = useState(user?.monthly_salary ? String(user.monthly_salary) : '')
  const [savingSalary, setSavingSalary] = useState(false)
  const [salaryError, setSalaryError] = useState<string | null>(null)
  const [salarySuccess, setSalarySuccess] = useState(false)

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profileEmail, setProfileEmail] = useState(user?.email || '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const handleSaveSalary = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSalary(true)
    setSalaryError(null)
    setSalarySuccess(false)

    try {
      const salary = parseFloat(monthlySalary)

      if (isNaN(salary) || salary < 0) {
        setSalaryError('Por favor ingresa un monto válido')
        setSavingSalary(false)
        return
      }

      const response = await authService.updateSettings({ monthly_salary: salary })
      updateUser(response.user)

      setSalarySuccess(true)
      setTimeout(() => setSalarySuccess(false), 3000)
    } catch (err: any) {
      console.error('Error al actualizar sueldo:', err)
      setSalaryError(err.response?.data?.message || 'Error al actualizar el sueldo')
    } finally {
      setSavingSalary(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileError(null)
    setProfileSuccess(false)

    try {
      if (!profileName.trim()) {
        setProfileError('El nombre es requerido')
        setSavingProfile(false)
        return
      }

      if (!profileEmail.trim() || !profileEmail.includes('@')) {
        setProfileError('Por favor ingresa un email válido')
        setSavingProfile(false)
        return
      }

      const response = await authService.updateProfile({
        name: profileName,
        email: profileEmail
      })

      updateUser(response.user)
      setIsEditingProfile(false)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error al actualizar perfil:', err)
      setProfileError(err.response?.data?.message || 'Error al actualizar el perfil')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingPassword(true)
    setPasswordError(null)
    setPasswordSuccess(false)

    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError('Todos los campos son requeridos')
        setChangingPassword(false)
        return
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('Las contraseñas no coinciden')
        setChangingPassword(false)
        return
      }

      if (newPassword.length < 6) {
        setPasswordError('La nueva contraseña debe tener al menos 6 caracteres')
        setChangingPassword(false)
        return
      }

      await authService.changePassword({
        currentPassword,
        newPassword
      })

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error al cambiar contraseña:', err)
      setPasswordError(err.response?.data?.message || 'Error al cambiar la contraseña')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-full bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Gestiona tu perfil y preferencias
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Profile Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 sm:p-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">Información Personal</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Tus datos de perfil</CardDescription>
                  </div>
                </div>
                {!isEditingProfile && (
                  <Button
                    onClick={() => {
                      setIsEditingProfile(true)
                      setProfileName(user?.name || '')
                      setProfileEmail(user?.email || '')
                      setProfileError(null)
                      setProfileSuccess(false)
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!isEditingProfile ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm text-gray-600">Nombre completo</Label>
                    <div className="flex items-center gap-2 sm:gap-3 rounded-lg border bg-gray-50 p-2 sm:p-3">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{user?.name}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm text-gray-600">Correo electrónico</Label>
                    <div className="flex items-center gap-2 sm:gap-3 rounded-lg border bg-gray-50 p-2 sm:p-3">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{user?.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm text-gray-600">Moneda</Label>
                    <div className="flex items-center gap-2 sm:gap-3 rounded-lg border bg-gray-50 p-2 sm:p-3">
                      <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <span className="font-medium text-gray-900 text-sm sm:text-base">{user?.currency}</span>
                    </div>
                  </div>

                  {profileSuccess && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-green-800">
                        ✓ Perfil actualizado correctamente
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm">Nombre completo</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Tu nombre"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  {profileError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-red-800">
                        ✗ {profileError}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="submit"
                      disabled={savingProfile}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs sm:text-sm"
                    >
                      {savingProfile ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingProfile(false)}
                      disabled={savingProfile}
                      className="text-xs sm:text-sm"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Monthly Salary */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-1.5 sm:p-2">
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">Sueldo Mensual</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Configura tu ingreso mensual</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSalary} className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-xs sm:text-sm">Sueldo mensual ({user?.currency})</Label>
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(e.target.value)}
                    className="text-base sm:text-lg"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    Este valor se usará para calcular tus estadísticas y disponible mensual
                  </p>
                </div>

                {salarySuccess && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-green-800">
                      ✓ Sueldo actualizado correctamente
                    </p>
                  </div>
                )}

                {salaryError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-red-800">
                      ✗ {salaryError}
                    </p>
                  </div>
                )}

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <strong>Consejo:</strong> Actualiza tu sueldo cada vez que haya cambios
                    para mantener tus estadísticas precisas.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={savingSalary}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs sm:text-sm"
                >
                  {savingSalary ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="border-0 shadow-lg lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-full bg-gradient-to-br from-red-500 to-pink-600 p-1.5 sm:p-2">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">Cambiar Contraseña</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Actualiza tu contraseña de acceso</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-3 sm:space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-xs sm:text-sm">Contraseña actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs sm:text-sm">Nueva contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="text-sm sm:text-base"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    Mínimo 6 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirmar nueva contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="text-sm sm:text-base"
                  />
                </div>

                {passwordSuccess && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-green-800">
                      ✓ Contraseña actualizada correctamente
                    </p>
                  </div>
                )}

                {passwordError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-red-800">
                      ✗ {passwordError}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={changingPassword}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-xs sm:text-sm w-full sm:w-auto"
                >
                  {changingPassword ? 'Cambiando...' : 'Cambiar contraseña'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
