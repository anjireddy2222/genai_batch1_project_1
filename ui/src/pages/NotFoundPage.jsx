import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-bg px-6 text-center">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-text-muted">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-3 rounded-control bg-primary px-4 py-2 text-sm font-medium text-primary-contrast transition-transform hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
      >
        Back to ResumeChat
      </Link>
    </div>
  )
}
