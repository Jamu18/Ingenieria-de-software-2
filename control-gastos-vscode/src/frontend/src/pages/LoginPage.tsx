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
import { Wallet, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-8">
          {/* Logo Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Wallet className="w-8 h-8 text-white" />
          </div>

          {/* Title with gradient */}
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Bienvenido
            </CardTitle>
            <CardDescription className="text-base mt-2 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Gestiona tus finanzas de manera inteligente</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Contraseña
                </Label>
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
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
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Iniciar sesión
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-medium">
                  ¿No tienes cuenta?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Crear cuenta gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Footer info */}
          <p className="mt-8 text-center text-xs text-gray-500">
            Al continuar, aceptas nuestros{' '}
            <a href="#" className="text-indigo-600 hover:underline">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="#" className="text-indigo-600 hover:underline">
              Política de Privacidad
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
