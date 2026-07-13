import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import BuilderPage from './pages/BuilderPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import { ResumeProvider } from './context/ResumeContext.jsx'

export default function App() {
  return (
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
  )
}
