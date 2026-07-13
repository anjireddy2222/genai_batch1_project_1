import ChatPanel from '../components/chat/ChatPanel.jsx'
import ResumePreview from '../components/preview/ResumePreview.jsx'

export default function BuilderPage() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <section aria-label="Chat" className="flex flex-1 flex-col border-r border-border">
        <ChatPanel />
      </section>
      <section aria-label="Resume preview" className="flex flex-1 flex-col bg-surface-2">
        <ResumePreview />
      </section>
    </div>
  )
}
