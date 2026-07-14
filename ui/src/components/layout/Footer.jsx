import { IconBrandGithub } from '@tabler/icons-react'

export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-3 text-xs text-text-muted sm:h-12 sm:flex-row sm:justify-between sm:gap-0 sm:px-6 sm:py-0">
        <span>© 2026 ResumeChat</span>
        <div className="flex items-center gap-4">
          <a href="#privacy" className="rounded-control transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            Privacy
          </a>
          <a href="#terms" className="rounded-control transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            Terms
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="ResumeChat on GitHub"
            className="rounded-control transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <IconBrandGithub size={16} stroke={1.75} />
          </a>
        </div>
      </div>
    </footer>
  )
}
