import { IconBrandGithub } from '@tabler/icons-react'

export default function Footer() {
  return (
    <footer className="h-12 shrink-0 border-t border-border bg-surface">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 text-xs text-text-muted sm:px-6">
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
