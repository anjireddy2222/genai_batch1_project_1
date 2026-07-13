import { useState } from 'react'
import ChatPanel from '../components/chat/ChatPanel.jsx'
import ResumePreview from '../components/preview/ResumePreview.jsx'

export default function BuilderPage() {
  const [resume, setResume] = useState(null)

  function handleResumeUpdate({ resume: nextResume }) {
    setResume(nextResume)
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <section aria-label="Chat" className="flex flex-1 flex-col border-r border-border">
        <ChatPanel onResumeUpdate={handleResumeUpdate} />
      </section>
      <section aria-label="Resume preview" className="flex flex-1 flex-col bg-surface-2">
        <ResumePreview resume={resume} />
      </section>
    </div>
  )
}
