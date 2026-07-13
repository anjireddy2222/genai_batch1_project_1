# Task 04 — API client & mock mode

## Objective
One clean data layer: a fetch wrapper matching the real backend contract, plus a full mock implementation so the UI runs without the backend.

## Pre-work (required)
Read the backend route definitions (READ ONLY) for chat and resume endpoints. Write/complete `ui/docs/api-contract.md` documenting every endpoint the UI uses: method, path, request body, response JSON (paste realistic examples). This file is the single source of truth going forward. Log any corrections to CLAUDE.md §6 assumptions in `actions.md`.

## Scope
- `src/api/client.js`: base fetch wrapper — base URL from `VITE_API_BASE_URL`, JSON handling, auth (cookie `credentials: 'include'` or Bearer header per Task 03 finding), normalized error objects `{ status, message }`, 401 → clears auth state
- `src/api/auth.js`, `src/api/chat.js`, `src/api/resume.js`: typed-by-convention functions (e.g. `sendMessage(conversationId, text)`)
- `src/api/mock.js`: full in-memory mock honoring the same contract —
  - Scripted interview: greeting → asks contact → target role → experience (probes for numbers, returns rewritten bullets) → education → skills → "ready to download"
  - Each reply returns an updated `resume` object and `completeness` (0–100)
  - Simulated latency 400–900ms; fake auth accepts any credentials
- Switch on `VITE_USE_MOCKS`; the rest of the app must not know which mode is active
- Replace Task 03's stubbed auth calls with this layer

## Acceptance criteria
- With `VITE_USE_MOCKS=true`: login works, `sendMessage` returns evolving resume state
- With mocks off and no backend running: UI shows graceful error states, no crashes
- `api-contract.md` exists and reflects the REAL backend routes
- Build passes; nothing outside `/ui` touched

## Done =
progress.md updated → commit `task-04: api client and mock mode` → push
