import { NavLink } from 'react-router-dom'
import { IconFileDescription, IconUserCircle } from '@tabler/icons-react'
import ThemeToggle from './ThemeToggle.jsx'

const navLinkClass = ({ isActive }) =>
  `rounded-control px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
    isActive ? 'text-text bg-surface-2' : 'text-text-muted hover:text-text hover:bg-surface-2'
  }`

export default function Navbar({ completeness = 0 }) {
  return (
    <header className="h-14 shrink-0 border-b border-border bg-surface dark:bg-surface-2">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-control bg-primary text-primary-contrast">
              <IconFileDescription size={18} stroke={1.75} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">ResumeChat</span>
          </div>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
            <NavLink to="/" end className={navLinkClass}>
              Builder
            </NavLink>
            <button
              type="button"
              className="rounded-control px-3 py-1.5 text-sm font-medium text-text-muted opacity-60 cursor-not-allowed"
              title="Coming soon"
              disabled
            >
              My resumes
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex" aria-label={`Resume ${completeness}% complete`}>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-xs text-text-muted whitespace-nowrap">{completeness}% complete</span>
          </div>

          <ThemeToggle />

          <button
            type="button"
            aria-label="User menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <IconUserCircle size={20} stroke={1.75} />
          </button>
        </div>
      </div>
    </header>
  )
}
