# Task 08 — PDF & DOCX downloads

## Objective
Working, polished download flow for both file formats.

## Pre-work (required)
Check whether the backend exposes PDF/DOCX generation endpoints (READ ONLY inspection).
- **If yes (preferred):** buttons fetch the file (with auth), create a blob URL, trigger download named `FirstName-LastName-Resume.pdf/.docx`. Mock mode returns a tiny valid placeholder file.
- **If no:** generate client-side from the resume JSON — `@react-pdf/renderer` for PDF, `docx` package for DOCX — matching the preview's ATS styling exactly. Log the added dependencies in `actions.md` and add a note under "Backend change requests" that server-side generation would be preferable.

## Scope
- Enable PDF/DOCX buttons when `completeness >= 100` (or backend-provided `ready` flag); disabled state has tooltip "Finish the interview to download"
- Button states: idle → spinner "Preparing…" → success flash (check icon) → idle. Errors show a small inline toast with retry.
- Downloads must work in both app themes (file content is identical regardless of theme)
- Filename sanitization (strip characters invalid on Windows/macOS)

## Acceptance criteria
- Completing the mock interview enables both buttons; each produces a correctly named, openable file
- Double-clicks don't trigger duplicate downloads
- Failure path (mock a 500) shows recoverable error UI
- Build passes

## Done =
progress.md updated → commit `task-08: pdf and docx downloads` → push
