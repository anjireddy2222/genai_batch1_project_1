import { useCallback, useEffect, useRef, useState } from 'react'
import { sendMessage } from '../../api/chat.js'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import ChatInput from './ChatInput.jsx'

let idCounter = 0
function nextId() {
  idCounter += 1
  return idCounter
}

export default function ChatPanel({ onResumeUpdate } = {}) {
  const [messages, setMessages] = useState([])
  const [conversationId, setConversationId] = useState(null)
  const [pending, setPending] = useState(false)
  const [loadingGreeting, setLoadingGreeting] = useState(true)
  const [error, setError] = useState(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const listRef = useRef(null)
  const bottomRef = useRef(null)

  const fetchGreeting = useCallback(() => {
    setLoadingGreeting(true)
    setError(null)
    return sendMessage(null, '')
      .then((res) => {
        setConversationId(res.conversationId)
        setMessages([{ id: nextId(), role: 'assistant', text: res.reply, suggestions: res.suggestions }])
        onResumeUpdate?.({ resume: res.resume, completeness: res.completeness })
      })
      .catch((err) => {
        setError({ message: err.message || "Couldn't start the conversation.", retry: 'greeting' })
      })
      .finally(() => setLoadingGreeting(false))
  }, [onResumeUpdate])

  useEffect(() => {
    fetchGreeting()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior, block: 'end' })
  }, [])

  useEffect(() => {
    if (autoScroll) scrollToBottom()
  }, [messages, pending, autoScroll, scrollToBottom])

  function handleScroll() {
    const el = listRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setAutoScroll(distanceFromBottom < 80)
  }

  async function submit(text) {
    if (!text.trim() || pending) return
    setError(null)
    const userMessageId = nextId()
    setMessages((prev) => [...prev, { id: userMessageId, role: 'user', text }])
    setPending(true)
    setAutoScroll(true)

    try {
      const res = await sendMessage(conversationId, text)
      setConversationId(res.conversationId)
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', text: res.reply, suggestions: res.suggestions },
      ])
      onResumeUpdate?.({ resume: res.resume, completeness: res.completeness })
    } catch (err) {
      setError({ message: err.message || "Couldn't send that message.", retry: text })
      setMessages((prev) => prev.map((msg) => (msg.id === userMessageId ? { ...msg, failed: true } : msg)))
    } finally {
      setPending(false)
    }
  }

  function handleRetry() {
    if (!error) return
    if (error.retry === 'greeting') {
      fetchGreeting()
      return
    }
    const text = error.retry
    setError(null)
    submit(text)
  }

  const lastAssistantId = [...messages].reverse().find((msg) => msg.role === 'assistant')?.id

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-bg">
      <div className="relative min-h-0 flex-1">
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto px-4 py-6 sm:px-6"
          aria-live="polite"
        >
          <div className="flex flex-col gap-4">
            {loadingGreeting && messages.length === 0 && <TypingIndicator />}
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLatest={message.id === lastAssistantId}
                onSuggestionClick={submit}
                onRetry={handleRetry}
              />
            ))}
            {pending && <TypingIndicator />}
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-control border border-danger bg-surface px-3 py-2 text-sm text-danger">
              <span className="flex-1">{error.message}</span>
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-control border border-danger px-2 py-1 text-xs font-medium transition-colors hover:bg-danger hover:text-primary-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Retry
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {!autoScroll && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setAutoScroll(true)
                scrollToBottom()
              }}
              className="pointer-events-auto rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-contrast shadow-md transition-transform hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
            >
              Jump to latest
            </button>
          </div>
        )}
      </div>

      <ChatInput onSend={submit} disabled={pending || loadingGreeting} />
    </div>
  )
}
