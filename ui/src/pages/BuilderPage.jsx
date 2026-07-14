import { useEffect, useRef, useState } from 'react'
import ChatPanel from '../components/chat/ChatPanel.jsx'
import ResumePreview from '../components/preview/ResumePreview.jsx'
import { useResume } from '../context/ResumeContext.jsx'

const TABS = [
  { id: 'chat', label: 'Chat' },
  { id: 'preview', label: 'Preview' },
]

export default function BuilderPage() {
  const { resumeVersion } = useResume()
  const [activeTab, setActiveTab] = useState('chat')
  const [previewDirty, setPreviewDirty] = useState(false)
  const lastVersionRef = useRef(resumeVersion)

  useEffect(() => {
    if (resumeVersion === lastVersionRef.current) return
    lastVersionRef.current = resumeVersion
    if (activeTab !== 'preview') setPreviewDirty(true)
  }, [resumeVersion, activeTab])

  function selectTab(id) {
    setActiveTab(id)
    if (id === 'preview') setPreviewDirty(false)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 gap-1 border-b border-border bg-surface p-2 tab:hidden" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => selectTab(tab.id)}
            className={`relative flex min-h-[44px] flex-1 items-center justify-center rounded-control text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === tab.id ? 'bg-surface-2 text-text' : 'text-text-muted hover:text-text'
            }`}
          >
            {tab.label}
            {tab.id === 'preview' && previewDirty && activeTab !== 'preview' && (
              <span className="absolute right-[28%] top-1.5 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden tab:flex-row">
        <section
          aria-label="Chat"
          className={`min-h-0 flex-1 flex-col tab:flex tab:border-r tab:border-border ${
            activeTab === 'chat' ? 'flex' : 'hidden'
          }`}
        >
          <ChatPanel />
        </section>
        <section
          aria-label="Resume preview"
          className={`min-h-0 flex-1 flex-col bg-surface-2 tab:flex tab:flex-[0.9] xl:flex-1 ${
            activeTab === 'preview' ? 'flex' : 'hidden'
          }`}
        >
          <ResumePreview />
        </section>
      </div>
    </div>
  )
}
