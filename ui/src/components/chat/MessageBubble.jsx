import { IconRefresh, IconSparkles } from '@tabler/icons-react'

function splitSegments(text) {
  const lines = text.split('\n')
  const segments = []
  let current = null
  for (const line of lines) {
    const type = line.trim().startsWith('• ') ? 'bullets' : 'text'
    if (!current || current.type !== type) {
      current = { type, lines: [] }
      segments.push(current)
    }
    current.lines.push(line)
  }
  return segments
}

export default function MessageBubble({ message, isLatest, onSuggestionClick, onRetry }) {
  const isUser = message.role === 'user'
  const segments = splitSegments(message.text)

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[88%] gap-2 tab:max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {!isUser && (
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-primary-contrast">
            <IconSparkles size={14} stroke={1.75} />
          </span>
        )}
        <div className="min-w-0">
          <div
            className={`px-4 py-2.5 text-[15px] leading-[1.55] ${
              isUser
                ? 'rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-[4px] bg-primary text-primary-contrast'
                : 'rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-[4px] bg-surface text-text'
            } ${message.failed ? 'opacity-60' : ''}`}
          >
            {segments.map((segment, index) =>
              segment.type === 'bullets' ? (
                <ul key={index} className="my-2 space-y-1 border-l-2 border-accent pl-3">
                  {segment.lines.map((line, lineIndex) => (
                    <li key={lineIndex} className="list-none">
                      {line.replace(/^•\s*/, '')}
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={index} className="whitespace-pre-wrap break-words">
                  {segment.lines.join('\n')}
                </p>
              )
            )}
          </div>

          {message.failed && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-1 flex items-center gap-1 rounded-control text-xs font-medium text-danger hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <IconRefresh size={12} stroke={2} />
              Failed to send — retry
            </button>
          )}

          {isLatest && message.suggestions?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSuggestionClick(suggestion)}
                  className="min-h-[36px] rounded-full border border-border bg-surface px-3 text-xs font-medium text-text transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
