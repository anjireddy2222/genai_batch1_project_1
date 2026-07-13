import ChatPanel from '../components/chat/ChatPanel.jsx'

export default function BuilderPage() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <section aria-label="Chat" className="flex flex-1 flex-col border-r border-border">
        <ChatPanel />
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
