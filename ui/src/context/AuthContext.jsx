import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth.js'
import { setUnauthorizedHandler } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    let cancelled = false
    authApi
      .getSession()
      .then(({ user: sessionUser }) => {
        if (!cancelled) setUser(sessionUser)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser((current) => {
        if (current) setSessionExpired(true)
        return null
      })
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  const login = useCallback(async (email, password) => {
    const { user: loggedInUser } = await authApi.login(email, password)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
  }, [])

  const clearSessionExpired = useCallback(() => setSessionExpired(false), [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, sessionExpired, clearSessionExpired }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
