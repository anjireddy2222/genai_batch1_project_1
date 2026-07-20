import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import BuilderPage from './pages/BuilderPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { ResumeProvider } from './context/ResumeContext.jsx'

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <ResumeProvider>
            <AppLayout />
          </ResumeProvider>
        }
      >
        <Route path="/" element={<BuilderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
