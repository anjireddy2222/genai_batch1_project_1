import { useState } from 'react'
import { IconCheck, IconDownload, IconLoader2 } from '@tabler/icons-react'
import { downloadBlob } from '../../utils/downloadBlob.js'
import { resumeFilename } from '../../utils/resumeFilename.js'

// Dynamically imported so @react-pdf/renderer and docx (large libraries only needed once a
// user actually downloads) don't bloat the main bundle everyone pays for on first load.
const GENERATORS = {
  pdf: async (resume) => (await import('../../utils/generateResumePdf.jsx')).generateResumePdf(resume),
  docx: async (resume) => (await import('../../utils/generateResumeDocx.js')).generateResumeDocx(resume),
}

export default function DownloadButton({ format, label, disabled, resume }) {
  const [status, setStatus] = useState('idle') // idle | preparing | success | error

  async function handleClick() {
    if (disabled || status === 'preparing') return
    setStatus('preparing')
    try {
      const blob = await GENERATORS[format](resume)
      downloadBlob(blob, resumeFilename(resume?.name, format))
      setStatus('success')
      window.setTimeout(() => setStatus('idle'), 1800)
    } catch {
      setStatus('error')
    }
  }

  const isBusy = status === 'preparing'
  const label_ = status === 'preparing' ? 'Preparing…' : status === 'success' ? 'Done' : label
  const Icon = status === 'preparing' ? IconLoader2 : status === 'success' ? IconCheck : IconDownload

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isBusy}
        title={disabled ? 'Finish the interview to download' : `Download ${label}`}
        aria-label={disabled ? `Download ${label}, available when your resume is complete` : `Download ${label}`}
        className={`flex items-center gap-1.5 rounded-control border px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98] ${
          disabled
            ? 'cursor-not-allowed border-border text-text-muted opacity-60'
            : status === 'success'
              ? 'border-success text-success'
              : 'border-border text-text hover:bg-surface-2'
        }`}
      >
        <Icon size={14} stroke={1.75} className={isBusy ? 'animate-spin' : ''} />
        {label_}
      </button>

      {status === 'error' && (
        <div className="absolute right-0 top-full z-10 mt-1 flex items-center gap-2 whitespace-nowrap rounded-control border border-danger bg-surface px-2 py-1.5 text-xs text-danger shadow-md">
          Couldn't generate the file.
          <button
            type="button"
            onClick={handleClick}
            className="font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
