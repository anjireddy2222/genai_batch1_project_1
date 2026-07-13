# Actions log

Claude Code records every autonomous decision here for later human review.
Format per entry:

```
## [YYYY-MM-DD] task-NN — <decision title>
- Context: why a decision was needed
- Decision: what was done
- Alternatives considered: brief
- Review needed: yes / no
```

Examples of things that MUST be logged: adding a dependency, deviating from a task file,
correcting the assumed API contract after reading backend code, choosing cookie vs JWT auth
handling, skipping or re-ordering a task, any workaround for a backend limitation.

---

## [2026-07-13] task-03 — Backend has no implemented routes; proceeding on assumed contract
- Context: Task 03 pre-work requires reading the backend's real auth routes (paths, payloads, session mechanism, Google OAuth flow) before building the login/auth UI.
- Decision: Inspected the backend at the repo root (read-only). `app.py` only defines `GET /` and never includes any router. `controller/auth.py` and `controller/resume.py` are empty (0-1 lines). `models/request.py`, `models/response.py`, `database/db.py`, `config/settings.py`, `services/resume_service.py`, `services/lls_service.py`, `agents/resume_agent.py` are all empty stubs (0-1 lines each). There is no implemented API contract to read. Per CLAUDE.md §3 fallback instructions, defaulting to: cookie session auth (`credentials: 'include'`) and server-redirect Google OAuth (`window.location.href = <backend google url>`). Built the full UI (auth, chat, resume) mock-first against the contract assumed in CLAUDE.md §6, documented in `ui/docs/api-contract.md`. Auth calls are isolated in `src/api/auth.js` so swapping to the real contract later (once the backend is implemented) is a one-file change.
- Alternatives considered: Blocking task-03/04 until backend is implemented — rejected, contradicts CLAUDE.md §1 rule 4 ("never wait for approval, keep moving") and the "work around it, log a backend change request" instruction.
- Review needed: yes — someone must implement the backend routes and confirm/correct the assumed contract in `ui/docs/api-contract.md` against the real implementation.

## [2026-07-13] task-03 — "Create an account" uses an in-page register mode, not a separate route
- Context: Task 03 scope says the "Create an account" link's route "can be a stub or the same form in register mode — decide and log."
- Decision: `LoginPage.jsx` toggles a local `mode` state (`login` | `register`) instead of introducing a `/register` route. Register mode adds a name field and changes the submit button label. No backend register endpoint is documented in CLAUDE.md §6 or discovered in the backend, so the stub `src/api/auth.js` `login()` is reused for both — it accepts any credentials. This is provisional; once a real backend register endpoint exists, this should likely call a distinct `register()` function.
- Alternatives considered: separate `/register` route/page — more realistic long-term but pure duplication today with no backend to differentiate behavior, and adds a route this task's scope didn't ask for.
- Review needed: yes — confirm against real backend whether register is even in scope for this product, or whether the app is invite/single-account only.

## [2026-07-13] task-04 — Mock conversation state persisted in sessionStorage
- Context: `src/api/mock.js` needs to hold conversation/resume state somewhere so multi-turn chat works. A pure in-memory module variable would reset on every page refresh, making Task 07's "session restore on load" acceptance criterion untestable in mock mode.
- Decision: mock chat/resume state is persisted to `sessionStorage` (clears when the tab closes, survives refresh); mock auth session persisted to `localStorage` (survives tab close too, mimicking a longer-lived cookie session). Both are pure mock conveniences, isolated in `src/api/mock.js` — the real `src/api/client.js` talks to the backend fresh every time and never touches storage itself.
- Alternatives considered: pure in-memory (simplest, but breaks session-restore testing on refresh); real IndexedDB (overkill for a mock).
- Review needed: no.

## [2026-07-13] task-04 — Resume file download mock returns placeholder bytes, not real PDF/DOCX
- Context: `src/api/mock.js` `downloadResume()` needs to return *something* for the download flow (Task 08) to exercise, but real PDF/DOCX generation is explicitly Task 08's scope.
- Decision: mock mode returns a tiny text `Blob` with the right MIME type (not a byte-valid PDF/DOCX) as a placeholder. Task 08 will replace this — either with a real mock file, or by moving generation client-side entirely (per its own pre-work decision, since the backend has no file-generation endpoints either — see "Backend change requests" below).
- Alternatives considered: building a real minimal valid PDF now — deferred to avoid duplicating work Task 08 will redo anyway once it decides the generation strategy.
- Review needed: no.

## [2026-07-13] task-05 — Bullet-list convention in assistant chat replies
- Context: CLAUDE.md's chat panel spec requires AI suggestion blocks (rewritten resume bullets) to render inside the message bubble as a left-border accent quote block, distinct from normal prose.
- Decision: `mock.js`'s `exp_detail` stage reply embeds the generated bullets as lines prefixed with `• ` inside the assistant's reply text (e.g. `"I turned that into resume bullets for you:\n• ...\n• ...\n\nWant to add..."`). `MessageBubble.jsx` parses a message's text into alternating text/bullet segments by detecting `• `-prefixed lines and renders bullet segments as a left-border accent `<ul>`. This is a convention between `mock.js` and `MessageBubble.jsx`, not part of the documented API contract — added a note in `ui/docs/api-contract.md`'s reply field description would be worth doing if the real backend adopts the same convention.
- Alternatives considered: a separate structured `suggestionBlock` field on the chat response — more explicit, but the CLAUDE.md contract in §6 doesn't define one and adding a field not in the assumed contract felt like a bigger deviation than a text convention the UI already has to parse for formatting anyway (line breaks, paragraphs).
- Review needed: no — but flag to whoever implements the real backend chat endpoint so replies use the same `• ` convention for rewritten bullets, or the contract should be extended with an explicit field.

---

## Backend change requests
Things the backend should change or add. The UI must not modify backend code — list requests here instead.

- **[2026-07-13] Backend is unimplemented.** `app.py` has no routers registered; `controller/auth.py`, `controller/resume.py`, `models/*.py`, `services/*.py`, `database/db.py`, `config/settings.py` are all empty. The UI was built entirely against the assumed contract in `ui/docs/api-contract.md` (cookie-session auth, server-redirect Google OAuth). Needed before the UI can run against a real backend:
  - `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/google`, `GET /api/me` — session-cookie based, CORS configured with `Access-Control-Allow-Credentials: true` and an explicit allowed origin (not `*`) so cookies work cross-origin during local dev (`http://localhost:5173` → API base URL).
  - `POST /api/chat` implementing the scripted interview (contact → target role → experience → education → skills), returning `{ reply, resume, completeness, suggestions? }` matching `ui/docs/api-contract.md`.
  - `GET /api/resume/:id/pdf` and `/docx` for file generation, OR confirmation that client-side generation (Task 08) is the intended long-term approach.
