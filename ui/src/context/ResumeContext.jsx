import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { getConversation, sendMessage } from '../api/chat.js'

const ResumeContext = createContext(null)

let idCounter = 0
function nextId() {
  idCounter += 1
  return idCounter
}

function sameJSON(a, b) {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null)
}

// Diffs at section granularity — coarse enough to be cheap, fine enough for the
// preview to know exactly which blocks to flash for the signature highlight moment.
function diffResume(prev, next) {
  const changed = new Set()
  if (!next) return changed

  const prevContact = prev?.contact
  const nextContact = next.contact
  if (prev?.name !== next.name || prev?.targetRole !== next.targetRole || !sameJSON(prevContact, nextContact)) {
    if (next.name || next.targetRole || nextContact?.email || nextContact?.phone || nextContact?.location) {
      changed.add('header')
    }
  }
  if (prev?.summary !== next.summary && next.summary) changed.add('summary')

  const maxExp = Math.max(prev?.experience?.length || 0, next.experience?.length || 0)
  for (let i = 0; i < maxExp; i += 1) {
    if (!sameJSON(prev?.experience?.[i], next.experience?.[i])) changed.add(`experience-${i}`)
  }

  const maxEdu = Math.max(prev?.education?.length || 0, next.education?.length || 0)
  for (let i = 0; i < maxEdu; i += 1) {
    if (!sameJSON(prev?.education?.[i], next.education?.[i])) changed.add(`education-${i}`)
  }

  if (!sameJSON(prev?.skills, next.skills) && next.skills?.length) changed.add('skills')

  return changed
}

export function ResumeProvider({ children }) {
  const [conversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [resume, setResume] = useState(null)
  const [completeness, setCompleteness] = useState(0)
  const [changedKeys, setChangedKeys] = useState(new Set())
  const [resumeVersion, setResumeVersion] = useState(0)
  const [pending, setPending] = useState(false)
  const [restoring, setRestoring] = useState(true)
  const [error, setError] = useState(null)

  const lastTurnRef = useRef(0)
  const resumeRef = useRef(null)

  function applyResumeUpdate(nextResume, nextCompleteness, turnId) {
    if (turnId != null) {
      if (turnId <= lastTurnRef.current) return
      lastTurnRef.current = turnId
    }
    const keys = diffResume(resumeRef.current, nextResume)
    resumeRef.current = nextResume
    setResume(nextResume)
    setCompleteness(nextCompleteness)
    setChangedKeys(keys)
    setResumeVersion((v) => v + 1)
  }

  async function startFresh() {
    setRestoring(true)
    setError(null)
    try {
      const res = await sendMessage(null, '')
      setConversationId(res.conversationId)
      setMessages([{ id: nextId(), role: 'assistant', text: res.reply, suggestions: res.suggestions }])
      lastTurnRef.current = res.turnId || 0
      resumeRef.current = res.resume
      setResume(res.resume)
      setCompleteness(res.completeness)
    } catch (err) {
      setError({ message: err.message || "Couldn't start the conversation.", retry: () => startFresh() })
    } finally {
      setRestoring(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    getConversation()
      .then((res) => {
        if (cancelled) return
        setConversationId(res.conversationId)
        setMessages(res.messages.map((m) => ({ id: nextId(), ...m })))
        lastTurnRef.current = res.messages[res.messages.length - 1]?.turnId || 0
        resumeRef.current = res.resume
        setResume(res.resume)
        setCompleteness(res.completeness)
        setRestoring(false)
      })
      .catch(() => {
        if (!cancelled) startFresh()
      })
    return () => {
      cancelled = true
    }
    // Runs once on mount only — session restore vs. fresh-start is decided a single time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function sendChatMessage(text, { retryId } = {}) {
    if (!text.trim() || pending) return
    setError(null)
    const userId = retryId ?? nextId()

    setMessages((prev) =>
      retryId
        ? prev.map((m) => (m.id === retryId ? { ...m, failed: false } : m))
        : [...prev, { id: userId, role: 'user', text }]
    )
    setPending(true)

    try {
      const res = await sendMessage(conversationId, text)
      setConversationId(res.conversationId)
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', text: res.reply, suggestions: res.suggestions, turnId: res.turnId },
      ])
      applyResumeUpdate(res.resume, res.completeness, res.turnId)
    } catch (err) {
      setError({
        message: err.message || "Couldn't send that message.",
        retry: () => sendChatMessage(text, { retryId: userId }),
      })
      setMessages((prev) => prev.map((m) => (m.id === userId ? { ...m, failed: true } : m)))
    } finally {
      setPending(false)
    }
  }

  return (
    <ResumeContext.Provider
      value={{
        conversationId,
        messages,
        resume,
        completeness,
        changedKeys,
        resumeVersion,
        pending,
        restoring,
        error,
        sendChatMessage,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within a ResumeProvider')
  return ctx
}
