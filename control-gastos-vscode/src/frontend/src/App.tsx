import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Lazy load protected pages for better performance
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ExpensesPage = lazy(() => import('@/pages/ExpensesPage').then(m => ({ default: m.ExpensesPage })))
const SavingsPage = lazy(() => import('@/pages/SavingsPage').then(m => ({ default: m.SavingsPage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <p className="text-sm text-gray-600">Cargando...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <ExpensesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings"
              element={
                <ProtectedRoute>
                  <SavingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
