import { useState, useEffect } from 'react'
import api from '@/lib/api'

export function ApiTest() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const testConnection = async () => {
      try {
        setLoading(true)
        const response = await api.get('/saludo')
        setMessage(response.data.mensaje)
        setError('')
      } catch (err: any) {
        setError(err.message || 'Error conectando con el backend')
        setMessage('')
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{
      padding: '20px',
      border: '2px solid #333',
      borderRadius: '8px',
      margin: '20px',
      maxWidth: '600px'
    }}>
      <h2>🔗 Prueba de Conexión Backend ↔ Frontend</h2>

      {loading && <p>⏳ Conectando con el backend...</p>}

      {message && (
        <div style={{
          padding: '15px',
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724'
        }}>
          <strong>✅ Conexión exitosa!</strong>
          <p>Respuesta del backend: <strong>{message}</strong></p>
        </div>
      )}

      {error && (
        <div style={{
          padding: '15px',
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24'
        }}>
          <strong>❌ Error de conexión</strong>
          <p>{error}</p>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Info:</strong></p>
        <ul>
          <li>Backend: http://localhost:3000</li>
          <li>Frontend: http://localhost:5173</li>
          <li>Proxy: /api → http://localhost:3000/api</li>
        </ul>
      </div>
    </div>
  )
}
