export default function BuilderPage() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <section
        aria-label="Chat panel placeholder"
        className="flex flex-1 flex-col items-center justify-center border-r border-border bg-bg p-8 text-center"
      >
        <p className="text-sm font-medium text-text-muted">Chat panel</p>
        <p className="mt-1 max-w-xs text-xs text-text-muted">
          Built in Task 05 — the AI interview will happen here.
        </p>
      </section>
      <section
        aria-label="Resume preview placeholder"
        className="flex flex-1 flex-col items-center justify-center bg-surface-2 p-8 text-center"
      >
        <p className="text-sm font-medium text-text-muted">Live resume preview</p>
        <p className="mt-1 max-w-xs text-xs text-text-muted">
          Built in Task 06 — the resume document will render here.
        </p>
      </section>
    </div>
  )
}
