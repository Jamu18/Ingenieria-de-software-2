import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Wallet, Mail, Lock, User, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currency, setCurrency] = useState('PEN')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register({ name, email, password, currency })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    'Control total de tus gastos',
    'Metas de ahorro personalizadas',
    'Reportes detallados',
    'Gratis para siempre'
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-8">
          {/* Logo Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Wallet className="w-8 h-8 text-white" />
          </div>

          {/* Title with gradient */}
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Crear cuenta
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Comienza a controlar tus finanzas hoy
            </CardDescription>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-1.5 text-xs text-gray-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Nombre completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Usa al menos 8 caracteres con letras y números
              </p>
            </div>

            {/* Currency Select */}
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-semibold text-gray-700">
                Moneda preferida
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="flex h-12 w-full rounded-md border border-gray-200 bg-white pl-10 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                >
                  <option value="USD">🇺🇸 USD - Dólar Estadounidense</option>
                  <option value="EUR">🇪🇺 EUR - Euro</option>
                  <option value="PEN">🇵🇪 PEN - Sol Peruano</option>
                  <option value="MXN">🇲🇽 MXN - Peso Mexicano</option>
                  <option value="ARS">🇦🇷 ARS - Peso Argentino</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-100">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">
                    !
                  </div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando tu cuenta...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Crear mi cuenta gratis
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center">
              Al crear una cuenta, aceptas nuestros{' '}
              <a href="#" className="text-emerald-600 hover:underline font-medium">
                Términos
              </a>{' '}
              y{' '}
              <a href="#" className="text-emerald-600 hover:underline font-medium">
                Privacidad
              </a>
            </p>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-medium">
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Inicia sesión aquí
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
