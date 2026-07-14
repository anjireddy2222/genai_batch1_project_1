import { Navigate, useLocation } from 'react-router-dom'
import { IconLoader2 } from '@tabler/icons-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-bg" aria-busy="true" aria-label="Checking session">
        <IconLoader2 size={24} className="animate-spin text-text-muted" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
