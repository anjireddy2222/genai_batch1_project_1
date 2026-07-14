import { useRef, useState } from 'react'
import { IconArrowUp } from '@tabler/icons-react'

const MAX_HEIGHT_PX = 130

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  function resize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`
  }

  function handleChange(event) {
    setValue(event.target.value)
    resize()
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  function submit() {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
    requestAnimationFrame(resize)
  }

  return (
    <div className="shrink-0 border-t border-border bg-surface px-4 py-3 sm:px-6">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type your answer…"
          aria-label="Message"
          disabled={disabled}
          className="max-h-[130px] min-h-[44px] flex-1 resize-none rounded-control border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-contrast transition-transform hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <IconArrowUp size={18} stroke={2} />
        </button>
      </div>
    </div>
  )
}
