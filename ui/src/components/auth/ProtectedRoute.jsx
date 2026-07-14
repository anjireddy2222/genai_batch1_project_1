import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { IconAlertTriangle, IconLoader2 } from '@tabler/icons-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { user, loading, sessionExpired, clearSessionExpired } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-bg" aria-busy="true" aria-label="Checking session">
        <IconLoader2 size={24} className="animate-spin text-text-muted" />
      </div>
    )
  }

  if (!user) {
    if (sessionExpired) {
      return (
        <div className="grid min-h-[100dvh] place-items-center bg-bg px-4">
          <div className="w-full max-w-sm rounded-card border border-border bg-surface p-8 text-center shadow-sm">
            <span className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-full bg-surface-2 text-danger">
              <IconAlertTriangle size={22} stroke={1.75} />
            </span>
            <h1 className="text-base font-semibold text-text">Session expired</h1>
            <p className="mt-2 text-sm text-text-muted">
              You've been signed out for security. Nothing is lost — your resume and conversation are saved and will
              be right where you left them once you sign back in.
            </p>
            <button
              type="button"
              onClick={() => {
                clearSessionExpired()
                navigate('/login', { replace: true, state: { from: location } })
              }}
              className="mt-5 w-full rounded-control bg-primary px-4 py-2.5 text-sm font-medium text-primary-contrast transition-transform hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
            >
              Sign in again
            </button>
          </div>
        </div>
      )
    }
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
