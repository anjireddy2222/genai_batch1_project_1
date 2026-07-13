const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

function apiError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
}

export async function apiRequest(path, { method = 'GET', body, responseType = 'json' } = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      credentials: 'include',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw apiError(0, 'Network error — check your connection and try again.')
  }

  if (response.status === 401) {
    unauthorizedHandler?.()
    throw apiError(401, 'Your session has expired. Please sign in again.')
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const data = await response.json()
      if (data?.message) message = data.message
    } catch {
      // response body wasn't JSON — keep the generic message
    }
    throw apiError(response.status, message)
  }

  if (response.status === 204) return null
  if (responseType === 'blob') return response.blob()
  return response.json()
}
