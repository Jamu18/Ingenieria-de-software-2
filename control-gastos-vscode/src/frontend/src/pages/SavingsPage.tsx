import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PiggyBank, TrendingUp, Target } from 'lucide-react'

export function SavingsPage() {
  return (
    <Layout>
      <div className="min-h-full bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Metas de Ahorro</h1>
          <p className="mt-2 text-gray-600">
            Establece y alcanza tus objetivos financieros
          </p>
        </div>

        {/* Coming Soon */}
        <Card className="border-0 shadow-lg">
          <CardContent className="flex flex-col items-center py-16">
            <div className="rounded-full bg-emerald-100 p-6">
              <PiggyBank className="h-16 w-16 text-emerald-600" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900">Próximamente</h3>
            <p className="mt-2 text-center text-gray-600 max-w-md">
              Estamos trabajando en esta funcionalidad. Pronto podrás crear metas de ahorro,
              hacer seguimiento de tu progreso y alcanzar tus objetivos financieros.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
              <div className="text-center">
                <div className="rounded-full bg-blue-100 p-3 w-fit mx-auto">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="mt-3 font-semibold text-gray-900">Define metas</h4>
                <p className="mt-1 text-sm text-gray-600">Establece objetivos de ahorro personalizados</p>
              </div>

              <div className="text-center">
                <div className="rounded-full bg-purple-100 p-3 w-fit mx-auto">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="mt-3 font-semibold text-gray-900">Progreso visual</h4>
                <p className="mt-1 text-sm text-gray-600">Ve tu avance en tiempo real</p>
              </div>

              <div className="text-center">
                <div className="rounded-full bg-green-100 p-3 w-fit mx-auto">
                  <PiggyBank className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="mt-3 font-semibold text-gray-900">Alcanza objetivos</h4>
                <p className="mt-1 text-sm text-gray-600">Cumple tus metas financieras</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
