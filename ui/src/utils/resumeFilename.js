// Strips characters invalid in filenames on Windows and macOS, collapses whitespace.
export function sanitizeFilename(name) {
  return name
    .trim()
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function resumeFilename(resumeName, extension) {
  const base = resumeName ? sanitizeFilename(resumeName).replace(/\s+/g, '-') : 'Resume'
  const withSuffix = /resume$/i.test(base) ? base : `${base}-Resume`
  return `${withSuffix}.${extension}`
}
