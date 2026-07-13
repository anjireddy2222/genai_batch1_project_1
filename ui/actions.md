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

## [2026-07-13] task-06 — Minimal resume-state lift into BuilderPage to make the preview testable
- Context: Task 06's acceptance criterion requires feeding progressively fuller resume JSON via a live mock conversation and confirming the preview renders correctly at every stage. `ResumePreview.jsx` is a pure `resume` prop-in component, but something has to supply that prop from the live conversation to actually exercise it end to end.
- Decision: `BuilderPage.jsx` now holds a single `useState` for `resume` and passes it to `ChatPanel` via the `onResumeUpdate` callback (already built in Task 05) and down to `ResumePreview`. This is intentionally minimal — it does NOT lift chat `messages` state, does not add the signature accent-flash highlight animation, does not handle out-of-order/stale turns, does not wire the navbar completeness pill, and does not do session restore. All of that remains Task 07's job per CLAUDE.md's own scope for that task; this lift only exists so Task 06 can be verified against real data instead of a static fixture.
- Alternatives considered: feeding `ResumePreview` a hardcoded fixture object for isolated testing, leaving zero wiring for Task 07 to add — rejected because it would ship a visibly disconnected preview panel (violates "no half-finished implementations" — a user opening the app would see chat and preview never talk to each other) for the span of one commit, and Task 07 would just be re-deriving this exact same wiring anyway.
- Review needed: no.

## [2026-07-13] task-07 — React Context (ResumeProvider) instead of BuilderPage-only state
- Context: CLAUDE.md's task-07 scope explicitly allows "BuilderPage (or a ResumeContext)" for the lifted state. The navbar's completeness pill (in `Navbar.jsx`, rendered by `AppLayout.jsx`) needs the *same* live `completeness` value as `BuilderPage`'s children — but `Navbar` is a sibling of `BuilderPage`'s route content, not a descendant, so state owned only by `BuilderPage` can't reach it without prop drilling through `AppLayout` and the router's `Outlet`.
- Decision: built `src/context/ResumeContext.jsx` (`ResumeProvider` / `useResume()`) holding `conversationId`, `messages`, `resume`, `completeness`, `changedKeys` (diff result for the highlight animation), `resumeVersion`, `pending`, `restoring`, and `error`. Mounted once in `App.jsx`, wrapping `AppLayout` inside `ProtectedRoute` (so it only exists for authenticated sessions). `Navbar`, `ChatPanel`, and `ResumePreview` all consume it directly via `useResume()` — no prop drilling. `ChatPanel` and `ResumePreview` were refactored from Task 05/06's local-state versions to pull from context instead.
- Alternatives considered: keep state in `BuilderPage` and prop-drill `completeness` through `AppLayout` → `Navbar` — rejected, since `AppLayout` renders `Navbar` and `<Outlet/>` as siblings with no natural channel for the *route's* state to reach the *layout's* navbar short of a second context anyway.
- Review needed: no.

## [2026-07-13] task-07 — Signature highlight: section-level diff + key-remount, not a manual class-toggle timer
- Context: the accent-flash highlight (CLAUDE.md §5 "Signature interaction") needs to restart cleanly every time a section's content changes, including when the same section changes twice in a row — a plain `useState` boolean + `setTimeout` to remove the class would not replay the CSS animation on a second rapid change without extra bookkeeping.
- Decision: `ResumeContext.applyResumeUpdate` diffs the previous vs. next resume object at section granularity (`header`, `summary`, `experience-{i}`, `education-{i}`, `skills`) into a `changedKeys` Set, and bumps a `resumeVersion` counter on every update. `ResumePreview` gives each section a React `key` that only changes when that specific section is in `changedKeys` for the current version (`{id}-{version}` vs. a stable `id`) — forcing a clean remount (and thus animation restart) exactly when, and only when, that section actually changed. `prefers-reduced-motion` is handled for free by the existing global CSS rule from Task 01 that collapses all animation durations to ~0.
- Alternatives considered: a `useState` map of `{ [sectionId]: timestamp }` cleared via `setTimeout` per section — works, but is strictly more bookkeeping (needs cleanup on unmount, per-timer tracking) for the same visual result the key-remount trick gets for free from React's own reconciliation.
- Review needed: no.

## [2026-07-13] task-08 — Client-side PDF/DOCX generation; new dependencies added
- Context: Task 08's pre-work requires checking whether the backend exposes PDF/DOCX generation endpoints. It doesn't — same empty-backend finding as task-03/04 (`app.py` has no routes beyond `GET /`). Per the task's own branching instructions, the fallback is client-side generation using `@react-pdf/renderer` (PDF) and `docx` (DOCX).
- Decision: added `@react-pdf/renderer` and `docx` as real `dependencies` in `package.json` — these are NOT in CLAUDE.md §4's approved list, but §4 itself says new dependencies are fine "with an actions.md entry explaining why," and Task 08's own instructions explicitly name these two packages for this exact fallback. Built `src/utils/ResumePdfDocument.jsx` (react-pdf `Document`/`Page`/`Text`/`View` tree styled to match `ResumePreview.jsx`: navy uppercase headings with a bottom rule, Times-Roman for the name as the closest PDF standard font to Georgia, Helvetica for body as the closest standard font to Arial — true Georgia/Arial aren't in the PDF standard 14 and embedding them was judged not worth the bundle-size/complexity cost for a mock-mode demo) and `src/utils/generateResumeDocx.js` (`docx` package, matching heading/color structure). `src/utils/resumeFilename.js` sanitizes the resume name into `FirstName-LastName-Resume.pdf`/`.docx`, stripping characters invalid on Windows/macOS (`\ / : * ? " < > |`).
- Alternatives considered: waiting for real backend endpoints — rejected, backend is unimplemented and blocking isn't an option per CLAUDE.md §1 rule 4. Kept the door open for a future backend to just have `DownloadButton.jsx` swap to a `fetch`+blob call — noted in `api-contract.md`.
- Review needed: yes — once the backend is implemented, evaluate whether server-side generation (more consistent fonts, works without shipping ~2 generation libraries to the client) should replace this.

## [2026-07-13] task-08 — Removed the now-dead mock download placeholder from Task 04
- Context: Task 04 added a provisional `downloadResume()` in `src/api/mock.js` and a thin `src/api/resume.js` wrapper, explicitly flagged in that task's actions.md entry as "Task 08 will replace this." Task 08's decision (client-side generation, above) means nothing calls the backend/mock for file bytes anymore — `resumeFilename`, `generateResumePdf`, and `generateResumeDocx` build the file directly from `ResumeContext`'s `resume` state.
- Decision: deleted `src/api/resume.js` and the `downloadResume` export from `src/api/mock.js` (confirmed via grep that nothing else referenced them) rather than leaving dead code that pretends to call an endpoint the app no longer uses.
- Alternatives considered: leaving them in place for a hypothetical future backend switch-over — rejected per "no unused code" / no speculative code for scenarios that can't happen yet; `api-contract.md` already documents where a future backend integration would plug in.
- Review needed: no.

---

## Backend change requests
Things the backend should change or add. The UI must not modify backend code — list requests here instead.

- **[2026-07-13] Backend is unimplemented.** `app.py` has no routers registered; `controller/auth.py`, `controller/resume.py`, `models/*.py`, `services/*.py`, `database/db.py`, `config/settings.py` are all empty. The UI was built entirely against the assumed contract in `ui/docs/api-contract.md` (cookie-session auth, server-redirect Google OAuth). Needed before the UI can run against a real backend:
  - `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/google`, `GET /api/me` — session-cookie based, CORS configured with `Access-Control-Allow-Credentials: true` and an explicit allowed origin (not `*`) so cookies work cross-origin during local dev (`http://localhost:5173` → API base URL).
  - `POST /api/chat` implementing the scripted interview (contact → target role → experience → education → skills), returning `{ reply, resume, completeness, suggestions? }` matching `ui/docs/api-contract.md`.
  - `GET /api/resume/:id/pdf` and `/docx` for file generation, OR confirmation that client-side generation (Task 08) is the intended long-term approach.
