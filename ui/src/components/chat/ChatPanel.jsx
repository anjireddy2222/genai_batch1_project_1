import { useCallback, useEffect, useRef, useState } from 'react'
import { useResume } from '../../context/ResumeContext.jsx'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import ChatInput from './ChatInput.jsx'

export default function ChatPanel() {
  const { messages, pending, restoring, error, sendChatMessage } = useResume()
  const [autoScroll, setAutoScroll] = useState(true)
  const listRef = useRef(null)
  const bottomRef = useRef(null)

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

  function handleSend(text) {
    setAutoScroll(true)
    sendChatMessage(text)
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
            {restoring && messages.length === 0 && <TypingIndicator />}
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLatest={message.id === lastAssistantId}
                onSuggestionClick={handleSend}
                onRetry={() => error?.retry?.()}
              />
            ))}
            {pending && <TypingIndicator />}
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-control border border-danger bg-surface px-3 py-2 text-sm text-danger">
              <span className="flex-1">{error.message}</span>
              <button
                type="button"
                onClick={() => error.retry?.()}
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

      <ChatInput onSend={handleSend} disabled={pending || restoring} />
    </div>
  )
}
