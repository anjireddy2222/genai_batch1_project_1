// TEMPORARY STUB for Task 03. Replaced by the real api layer (src/api/client.js +
// src/api/mock.js, switched on VITE_USE_MOCKS) in Task 04. In-memory + localStorage-backed
// fake auth so the login flow is testable in isolation before the full mock system exists.
// See ui/docs/api-contract.md for the real contract this mimics.

const STORAGE_KEY = 'resumechat_stub_session'

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStoredUser(user) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  else localStorage.removeItem(STORAGE_KEY)
}

export async function login(email, password) {
  await delay(500)
  if (!email || !password) {
    const error = new Error('Invalid email or password')
    error.status = 401
    throw error
  }
  const namePart = email.split('@')[0].replace(/[._]/g, ' ')
  const user = {
    id: 'u_1',
    name: namePart.replace(/\b\w/g, (c) => c.toUpperCase()),
    email,
  }
  writeStoredUser(user)
  return { user }
}

export async function logout() {
  await delay(200)
  writeStoredUser(null)
}

export async function getSession() {
  await delay(300)
  const user = readStoredUser()
  if (!user) {
    const error = new Error('Not authenticated')
    error.status = 401
    throw error
  }
  return { user }
}

export function googleLoginUrl() {
  return '#google-oauth-not-configured'
}
