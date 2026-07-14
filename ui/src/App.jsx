import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { IconLoader2 } from '@tabler/icons-react'
import AppLayout from './components/layout/AppLayout.jsx'
import BuilderPage from './pages/BuilderPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import { ResumeProvider } from './context/ResumeContext.jsx'

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))

function RouteFallback() {
  return (
    <div className="grid min-h-[100dvh] place-items-center bg-bg" aria-busy="true" aria-label="Loading">
      <IconLoader2 size={24} className="animate-spin text-text-muted" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <ResumeProvider>
                <AppLayout />
              </ResumeProvider>
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<BuilderPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
