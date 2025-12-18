import { Sidebar } from '@/components/Sidebar'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      <Sidebar isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
