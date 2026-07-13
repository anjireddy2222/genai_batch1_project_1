import { useTheme } from './hooks/useTheme.js'

const SWATCHES = [
  ['bg', 'Page background'],
  ['surface', 'Surface'],
  ['surface-2', 'Surface 2'],
  ['primary', 'Primary'],
  ['accent', 'Accent'],
  ['success', 'Success'],
  ['danger', 'Danger'],
  ['text', 'Text'],
  ['text-muted', 'Text muted'],
  ['border', 'Border'],
]

const THEME_OPTIONS = ['light', 'dark', 'system']

export default function App() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-bg text-text px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl mb-1">ResumeChat — design token demo</h1>
        <p className="text-text-muted mb-6">
          Temporary page for Task 01. Replaced by the real app shell in Task 02.
        </p>

        <div className="flex gap-2 mb-8" role="group" aria-label="Theme">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTheme(option)}
              aria-pressed={theme === option}
              className={`rounded-control border px-3 py-1.5 text-sm capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                theme === option
                  ? 'bg-primary text-primary-contrast border-primary'
                  : 'bg-surface text-text border-border hover:bg-surface-2'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {SWATCHES.map(([token, label]) => (
            <div key={token} className="rounded-card border border-border overflow-hidden bg-surface">
              <div className="h-16" style={{ backgroundColor: `var(--${token})` }} />
              <div className="p-2 text-xs">
                <div className="font-medium">{label}</div>
                <div className="text-text-muted">--{token}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
