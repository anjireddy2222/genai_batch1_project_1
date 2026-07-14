import { useEffect, useRef, useState } from 'react'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { useTheme } from '../../hooks/useTheme.js'

const THEME_OPTIONS = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [rendered, setRendered] = useState(false)
  const { theme, setTheme } = useTheme()
  const containerRef = useRef(null)

  useEffect(() => {
    if (open) {
      setRendered(true)
      return undefined
    }
    if (!rendered) return undefined
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeout = window.setTimeout(() => setRendered(false), reduceMotion ? 0 : 150)
    return () => window.clearTimeout(timeout)
  }, [open, rendered])

  useEffect(() => {
    if (!open) return undefined

    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false)
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="relative tab:hidden" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="grid h-11 w-11 place-items-center rounded-control border border-border text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
      >
        {open ? <IconX size={20} stroke={1.75} /> : <IconMenu2 size={20} stroke={1.75} />}
      </button>

      {rendered && (
        <div
          role="menu"
          className={`absolute right-0 z-20 mt-2 w-56 rounded-card border border-border bg-surface p-2 shadow-lg ${
            open ? 'dropdown-in' : 'dropdown-out'
          }`}
        >
          <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-text-muted">Navigate</p>
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block min-h-[44px] w-full rounded-control px-2 text-left text-sm text-text hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
          >
            Builder
          </button>
          <button
            type="button"
            role="menuitem"
            disabled
            className="block min-h-[44px] w-full cursor-not-allowed rounded-control px-2 text-left text-sm text-text-muted opacity-60"
          >
            My resumes
          </button>

          <div className="my-2 h-px bg-border" />

          <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-text-muted">Theme</p>
          <div className="flex gap-1 px-2 pb-1">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option.id)}
                aria-pressed={theme === option.id}
                className={`min-h-[40px] flex-1 rounded-control border px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98] ${
                  theme === option.id
                    ? 'border-primary bg-primary text-primary-contrast'
                    : 'border-border text-text hover:bg-surface-2'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
