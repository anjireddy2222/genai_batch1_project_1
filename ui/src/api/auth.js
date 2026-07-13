import { apiRequest } from './client.js'
import * as mock from './mock.js'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

export async function login(email, password) {
  if (useMocks) return mock.login(email, password)
  return apiRequest('/api/auth/login', { method: 'POST', body: { email, password } })
}

export async function logout() {
  if (useMocks) return mock.logout()
  return apiRequest('/api/auth/logout', { method: 'POST' })
}

export async function getSession() {
  if (useMocks) return mock.getSession()
  return apiRequest('/api/me')
}

export function googleLoginUrl() {
  if (useMocks) return '#google-oauth-mock'
  const base = import.meta.env.VITE_API_BASE_URL || ''
  return `${base}/api/auth/google`
}
