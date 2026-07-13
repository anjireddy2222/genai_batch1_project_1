import { apiRequest } from './client.js'
import * as mock from './mock.js'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

// Provisional: the real backend doesn't expose file generation yet (see
// ui/actions.md "Backend change requests"). Task 08 decides the long-term approach
// (server fetch vs. client-side generation) and may change this implementation.
export async function downloadResume(conversationId, format) {
  if (useMocks) return mock.downloadResume(conversationId, format)
  return apiRequest(`/api/resume/${conversationId}/${format}`, { responseType: 'blob' })
}
