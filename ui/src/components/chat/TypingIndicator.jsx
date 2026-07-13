import { IconSparkles } from '@tabler/icons-react'

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2" role="status" aria-label="AI is typing">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-primary-contrast">
        <IconSparkles size={14} stroke={1.75} />
      </span>
      <div className="flex items-center gap-1 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-[4px] bg-surface px-4 py-3">
        <span className="typing-dot" />
        <span className="typing-dot" style={{ animationDelay: '0.15s' }} />
        <span className="typing-dot" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  )
}
