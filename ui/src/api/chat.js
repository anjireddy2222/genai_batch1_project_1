import { apiRequest } from './client.js'
import * as mock from './mock.js'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

export async function sendMessage(conversationId, message) {
  if (useMocks) return mock.sendMessage(conversationId, message)
  return apiRequest('/chat', { method: 'POST', body: { conversationId, message } })
}

export async function getConversation() {
  if (useMocks) return mock.getConversation()
  return apiRequest('/api/conversation')
}




