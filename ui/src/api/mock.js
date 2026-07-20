// Full in-memory mock of the backend contract in ui/docs/api-contract.md.
// Used whenever VITE_USE_MOCKS=true so the UI is testable without the backend.
// Conversation/resume state lives in sessionStorage so Task 07's "session restore on load"
// is genuinely exercisable, but clears when the tab closes (a mock, not a real backend).

const CONVERSATION_KEY = 'resumechat_mock_conversation'

function delay(min = 400, max = 900) {
  const ms = min + Math.random() * (max - min)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readJSON(storage, key) {
  try {
    const raw = storage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeJSON(storage, key, value) {
  if (value === null || value === undefined) storage.removeItem(key)
  else storage.setItem(key, JSON.stringify(value))
}

// ---------------------------------------------------------------------------
// Chat / resume interview
// ---------------------------------------------------------------------------

function emptyResume() {
  return {
    name: '',
    contact: { email: '', phone: '', location: '' },
    targetRole: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
  }
}

function titleCase(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function extractContact(text) {
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)
  const phoneMatch = text.match(/(\+?\d[\d\-\s().]{7,}\d)/)
  const email = emailMatch ? emailMatch[0] : ''
  const phone = phoneMatch ? phoneMatch[0].trim() : ''

  let rest = text
  if (email) rest = rest.replace(email, '')
  if (phone) rest = rest.replace(phone, '')

  const parts = rest
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  const name = parts.length > 0 ? titleCase(parts[0]) : 'Your Name'
  const location = parts.length > 1 ? titleCase(parts[parts.length - 1]) : ''

  return { name, email, phone, location }
}

function extractDates(text) {
  const years = text.match(/\b(19|20)\d{2}\b/g) || []
  const isPresent = /present|current/i.test(text)
  const startDate = years[0] || ''
  const endDate = isPresent ? 'Present' : years[1] || (years.length === 1 ? 'Present' : '')
  return { startDate, endDate }
}

function parseExperienceBasics(text) {
  const { startDate, endDate } = extractDates(text)
  const cleaned = text
    .replace(/\b(19|20)\d{2}\b/g, '')
    .replace(/present|current/gi, '')
    .replace(/\b(to|since|through)\b/gi, '')
    .replace(/,\s*,/g, ',')
    .replace(/,\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  const separator = /\s+at\s+|\s+@\s+/i
  let title = cleaned
  let company = 'the company'
  if (separator.test(cleaned)) {
    const [titlePart, ...rest] = cleaned.split(separator)
    title = titlePart.trim()
    company = rest.join(' ').replace(/,\s*$/, '').trim() || company
  }
  return {
    title: title ? titleCase(title) : 'Your Role',
    company: titleCase(company),
    startDate,
    endDate,
  }
}

function rewriteBullets(text, targetRole) {
  const cleaned = text.trim().replace(/\.$/, '')
  const first = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  const hasNumber = /\d/.test(cleaned)
  const bullets = [`${first}${hasNumber ? '' : ', improving team output'}.`]
  if (hasNumber) {
    bullets.push(`Recognized for measurable results that directly supported ${targetRole || 'business'} goals.`)
  } else {
    bullets.push(`Collaborated cross-functionally to support ${targetRole || 'team'} priorities.`)
  }
  return bullets
}

function parseEducation(text) {
  const years = text.match(/\b(19|20)\d{2}\b/g) || []
  const endDate = years[years.length - 1] || ''
  const parts = text
    .replace(/\b(19|20)\d{2}\b/g, '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  return {
    degree: parts[0] ? titleCase(parts[0]) : 'Degree',
    school: parts[1] ? titleCase(parts[1]) : 'School',
    location: parts[2] ? titleCase(parts[2]) : '',
    startDate: '',
    endDate,
  }
}

function parseSkills(text) {
  return text
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)
}

const GREETING =
  "Hi! I'm going to help you build a sharp, ATS-friendly resume in just a few minutes. " +
  "Let's start with the basics — what's your full name, email, phone, and city?"

function applyTurn(state, text) {
  const resume = structuredClone(state.resume)
  let reply = ''
  let suggestions
  let completeness = state.completeness
  let nextStage = state.stage

  switch (state.stage) {
    case 'contact': {
      const contact = extractContact(text)
      resume.name = contact.name
      resume.contact = { email: contact.email, phone: contact.phone, location: contact.location }
      completeness = 20
      nextStage = 'role'
      reply = `Nice to meet you, ${contact.name.split(' ')[0]}. What role are you targeting next? For example "Product Manager" or "Backend Engineer".`
      break
    }
    case 'role': {
      const role = titleCase(text) || 'Your Target Role'
      resume.targetRole = role
      resume.summary = `${role} with a track record of delivering measurable results.`
      completeness = 35
      nextStage = 'exp_title'
      reply = `Got it — ${role}. Now tell me about your most recent job: your title, the company, and roughly when you worked there.`
      break
    }
    case 'exp_title': {
      const basics = parseExperienceBasics(text)
      resume.experience = [...resume.experience, { ...basics, location: '', bullets: [] }]
      completeness = Math.max(completeness, 50)
      nextStage = 'exp_detail'
      reply =
        'Great. Now the important part — what did you actually accomplish there? Numbers help a lot, like "grew signups 30%" or "led a team of 5".'
      break
    }
    case 'exp_detail': {
      const bullets = rewriteBullets(text, resume.targetRole)
      const experience = [...resume.experience]
      experience[experience.length - 1] = { ...experience[experience.length - 1], bullets }
      resume.experience = experience
      completeness = 65
      nextStage = 'post_experience'
      reply = `I turned that into resume bullets for you:\n${bullets.map((bullet) => `• ${bullet}`).join('\n')}\n\nWant to add another role, or should we move on to education?`
      suggestions = ['Add another role', 'Move to education']
      break
    }
    case 'post_experience': {
      if (/another|add/i.test(text)) {
        nextStage = 'exp_title'
        reply = 'Sure — what was the title, company, and dates for that role?'
      } else {
        nextStage = 'education'
        completeness = 75
        reply = "Let's cover education — what's your degree or certification, school, and graduation year?"
      }
      break
    }
    case 'education': {
      resume.education = [...resume.education, parseEducation(text)]
      completeness = 85
      nextStage = 'skills'
      reply = 'Almost done — list your key skills, separated by commas.'
      break
    }
    case 'skills': {
      resume.skills = parseSkills(text)
      completeness = 100
      nextStage = 'done'
      reply =
        'Your resume is ready to download! Keep refining it by telling me what to change, or grab the PDF/DOCX now.'
      suggestions = ['Looks good', 'Edit summary']
      break
    }
    default: {
      completeness = 100
      nextStage = 'done'
      reply = "Noted — I've kept your resume as is. Download whenever you're ready, or tell me what you'd like to change."
    }
  }

  return { resume, reply, suggestions, completeness, nextStage }
}

function newConversationId() {
  return `c_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function loadConversation() {
  return readJSON(sessionStorage, CONVERSATION_KEY)
}

function saveConversation(state) {
  writeJSON(sessionStorage, CONVERSATION_KEY, state)
}

export async function sendMessage(conversationId, message) {
  await delay()

  if (!conversationId) {
    const state = {
      conversationId: newConversationId(),
      stage: 'contact',
      turnId: 1,
      completeness: 0,
      resume: emptyResume(),
      messages: [{ role: 'assistant', text: GREETING, turnId: 1 }],
    }
    saveConversation(state)
    return {
      conversationId: state.conversationId,
      turnId: state.turnId,
      reply: GREETING,
      resume: state.resume,
      completeness: state.completeness,
    }
  }

  const existing = loadConversation()
  const state =
    existing && existing.conversationId === conversationId
      ? existing
      : {
          conversationId,
          stage: 'contact',
          turnId: 1,
          completeness: 0,
          resume: emptyResume(),
          messages: [{ role: 'assistant', text: GREETING, turnId: 1 }],
        }

  const turn = applyTurn(state, message)
  const turnId = state.turnId + 1

  const next = {
    ...state,
    stage: turn.nextStage,
    completeness: turn.completeness,
    resume: turn.resume,
    turnId,
    messages: [
      ...state.messages,
      { role: 'user', text: message, turnId },
      { role: 'assistant', text: turn.reply, turnId, suggestions: turn.suggestions },
    ],
  }
  saveConversation(next)

  return {
    conversationId,
    turnId,
    reply: turn.reply,
    suggestions: turn.suggestions,
    resume: turn.resume,
    completeness: turn.completeness,
  }
}

export async function getConversation() {
  await delay(150, 350)
  const state = loadConversation()
  if (!state) {
    const error = new Error('No conversation found')
    error.status = 404
    throw error
  }
  return {
    conversationId: state.conversationId,
    messages: state.messages,
    resume: state.resume,
    completeness: state.completeness,
  }
}
