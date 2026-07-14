import { useEffect, useRef } from 'react'
import { IconCircleCheck } from '@tabler/icons-react'
import { useResume } from '../../context/ResumeContext.jsx'
import DownloadButton from './DownloadButton.jsx'

const EMPTY_RESUME = {
  name: '',
  contact: { email: '', phone: '', location: '' },
  targetRole: '',
  summary: '',
  experience: [],
  education: [],
  skills: [],
}

function SkeletonLine({ width = '100%' }) {
  return <div className="h-[9px] rounded-full bg-gray-200" style={{ width }} />
}

function formatDateRange(start, end) {
  if (!start && !end) return ''
  if (start && end) return `${start} – ${end}`
  return start || end
}

function ContactLine({ contact }) {
  const parts = [contact?.email, contact?.phone, contact?.location].filter(Boolean)
  if (parts.length === 0) {
    return (
      <div className="mx-auto mt-1.5 flex justify-center">
        <SkeletonLine width="220px" />
      </div>
    )
  }
  return <p className="mt-1 text-[10.5px] text-[#3a3a3a]">{parts.join(' · ')}</p>
}

function SectionHeading({ children }) {
  return (
    <h2 className="mb-1.5 mt-4 border-b border-[#1E3A5F] pb-0.5 text-[10.5px] font-bold uppercase tracking-wide text-[#1E3A5F] first:mt-0">
      {children}
    </h2>
  )
}

export default function ResumePreview() {
  const { resume, completeness, changedKeys, resumeVersion } = useResume()
  const data = resume || EMPTY_RESUME
  const hasExperience = data.experience?.length > 0
  const hasEducation = data.education?.length > 0
  const hasSkills = data.skills?.length > 0

  const sectionRefs = useRef({})
  const followRef = useRef(true)
  const programmaticRef = useRef(false)

  function sectionKey(id) {
    return changedKeys.has(id) ? `${id}-${resumeVersion}` : id
  }

  function sectionRest(id, baseClassName = '') {
    const isChanged = changedKeys.has(id)
    return {
      ref: (el) => {
        sectionRefs.current[id] = el
      },
      className: `${baseClassName} -mx-1 rounded px-1 ${isChanged ? 'highlight-flash' : ''}`.trim(),
    }
  }

  function handlePreviewScroll() {
    if (programmaticRef.current) return
    followRef.current = false
  }

  useEffect(() => {
    if (!changedKeys || changedKeys.size === 0) return
    if (!followRef.current) return
    const targetKey = [...changedKeys][changedKeys.size - 1]
    const el = sectionRefs.current[targetKey]
    if (!el) return
    programmaticRef.current = true
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const timeout = window.setTimeout(() => {
      programmaticRef.current = false
    }, 700)
    return () => window.clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeVersion])

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <span className="text-sm font-medium text-text">Live preview</span>
        <div className="flex items-center gap-2">
          <DownloadButton format="pdf" label="PDF" disabled={completeness < 100} resume={data} />
          <DownloadButton format="docx" label="DOCX" disabled={completeness < 100} resume={data} />
        </div>
      </div>

      <div onScroll={handlePreviewScroll} className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">
        <div
          className="mx-auto max-w-[680px] rounded-card border border-border bg-white px-5 py-6 text-[#111111] shadow-sm sm:px-10 sm:py-9"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '10.5px', lineHeight: 1.55 }}
        >
          <header key={sectionKey('header')} {...sectionRest('header', 'text-center')}>
            {data.name ? (
              <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-[18px] font-normal leading-tight text-[#111111]">
                {data.name}
              </h1>
            ) : (
              <div className="mx-auto flex justify-center">
                <SkeletonLine width="180px" />
              </div>
            )}
            <ContactLine contact={data.contact} />
            {data.targetRole && <p className="mt-0.5 italic text-[#3a3a3a]">{data.targetRole}</p>}
          </header>

          <section key={sectionKey('summary')} {...sectionRest('summary')}>
            <SectionHeading>Summary</SectionHeading>
            {data.summary ? <p>{data.summary}</p> : <SkeletonLine width="92%" />}
          </section>

          <section>
            <SectionHeading>Work Experience</SectionHeading>
            {hasExperience ? (
              <div className="space-y-3">
                {data.experience.map((job, index) => (
                  <div key={sectionKey(`experience-${index}`)} {...sectionRest(`experience-${index}`)}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-bold">
                        {job.title || 'Role'} — {job.company || 'Company'}
                      </p>
                      <p className="whitespace-nowrap text-[#3a3a3a]">{formatDateRange(job.startDate, job.endDate)}</p>
                    </div>
                    {job.location && <p className="text-[#3a3a3a]">{job.location}</p>}
                    {job.bullets?.length > 0 ? (
                      <ul className="mt-1 list-disc space-y-0.5 pl-4">
                        {job.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex}>{bullet}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-1">
                        <SkeletonLine width="75%" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                <SkeletonLine width="70%" />
                <SkeletonLine width="90%" />
                <SkeletonLine width="55%" />
              </div>
            )}
          </section>

          <section>
            <SectionHeading>Education</SectionHeading>
            {hasEducation ? (
              <div className="space-y-2">
                {data.education.map((edu, index) => (
                  <div
                    key={sectionKey(`education-${index}`)}
                    {...sectionRest(`education-${index}`, 'flex items-baseline justify-between gap-3')}
                  >
                    <p>
                      <span className="font-bold">{edu.degree || 'Degree'}</span> — {edu.school || 'School'}
                    </p>
                    <p className="whitespace-nowrap text-[#3a3a3a]">{formatDateRange(edu.startDate, edu.endDate)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <SkeletonLine width="65%" />
            )}
          </section>

          <section key={sectionKey('skills')} {...sectionRest('skills')}>
            <SectionHeading>Skills</SectionHeading>
            {hasSkills ? <p>{data.skills.join(', ')}</p> : <SkeletonLine width="80%" />}
          </section>
        </div>

        <p className="mx-auto mt-3 flex max-w-[680px] items-center gap-1.5 text-xs text-text-muted">
          <IconCircleCheck size={14} stroke={1.75} className="text-success" />
          ATS check: single column, standard headings, parseable fonts
        </p>
      </div>
    </div>
  )
}
