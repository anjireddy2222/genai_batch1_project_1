import { NavLink } from 'react-router-dom'
import { IconFileDescription } from '@tabler/icons-react'
import ThemeToggle from './ThemeToggle.jsx'
import UserMenu from './UserMenu.jsx'
import MobileMenu from './MobileMenu.jsx'
import { useResume } from '../../context/ResumeContext.jsx'

const navLinkClass = ({ isActive }) =>
  `rounded-control px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
    isActive ? 'text-text bg-surface-2' : 'text-text-muted hover:text-text hover:bg-surface-2'
  }`

export default function Navbar() {
  const { completeness } = useResume()

  return (
    <header className="h-14 shrink-0 border-b border-border bg-surface dark:bg-surface-2">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-control bg-primary text-primary-contrast">
              <IconFileDescription size={18} stroke={1.75} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">ResumeChat</span>
          </div>
          <nav className="hidden items-center gap-1 tab:flex" aria-label="Primary">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 tab:flex" aria-label={`Resume ${completeness}% complete`}>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-xs text-text-muted whitespace-nowrap">{completeness}% complete</span>
          </div>

          <div className="flex items-center gap-1.5 tab:hidden" aria-label={`Resume ${completeness}% complete`}>
            <div className="h-1.5 w-10 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-xs text-text-muted whitespace-nowrap">{completeness}%</span>
          </div>

          <div className="hidden tab:block">
            <ThemeToggle />
          </div>

          <UserMenu />

          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
