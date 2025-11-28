import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Settings,
  LogOut,
  Wallet,
  ChevronRight
} from 'lucide-react'

export function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Gastos', href: '/expenses', icon: Receipt },
    { name: 'Metas de Ahorro', href: '/savings', icon: PiggyBank },
    { name: 'Configuración', href: '/settings', icon: Settings },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-gray-700 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Control Gastos</h2>
          <p className="text-xs text-gray-400">Versión 1.0</p>
        </div>
      </div>

      {/* User Info */}
      <div className="border-b border-gray-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-medium">{user?.name}</p>
            <p className="truncate text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              `}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
              {active && <ChevronRight className="h-4 w-4" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-700 p-4">
        <Button
          onClick={logout}
          variant="outline"
          className="w-full justify-start gap-3 border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700/50 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
