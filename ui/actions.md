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

## [2026-07-14] task-09 — Custom `tab` (900px) Tailwind breakpoint instead of a default one
- Context: the split-screen-vs-tab-bar threshold specified in the task (below 900px collapses to tabs) doesn't line up with any of Tailwind's default breakpoints (768/1024). Using `md`/`lg` directly would either collapse too early or too late relative to the spec.
- Decision: added a custom `tab: '900px'` screen in `tailwind.config.js` and used `tab:` variants throughout (`Navbar`, `MobileMenu`, `BuilderPage`, `MessageBubble`) so the split/tab-bar and nav-links/hamburger transitions all happen at exactly 900px, matching the task's stated breakpoint rather than approximating it with a stock one.
- Alternatives considered: `lg` (1024px) — rejected, collapses later than specified and would leave the split screen visibly cramped between 900–1024px on the laptop breakpoint the task calls out separately.
- Review needed: no.

## [2026-07-14] task-09 — Preview scaling done via fluid sizing, not a CSS `transform: scale` wrapper
- Context: task scope offers two options for the mobile preview ("CSS `transform: scale` wrapper or fluid sizing") so the resume still reads as a document at narrow widths.
- Decision: went with fluid sizing — the document card's horizontal padding shrinks (`px-5` → `sm:px-10`) and it stays `max-w-[680px]` with `mx-auto`, while the resume's font sizes stay fixed (10.5px body per CLAUDE.md §5) so the document doesn't get illegibly tiny the way a scaled-down transform would at 375px. Verified via Playwright screenshots at 375/390/768/1024/1280/1536 — reads clearly as a document at every width with zero horizontal overflow.
- Alternatives considered: `transform: scale()` wrapper — would shrink text along with layout, making body copy hard to read on small phones; rejected in favor of fluid sizing which the task explicitly allows as an alternative.
- Review needed: no.

## [2026-07-14] task-09 — Picked up and completed pre-existing uncommitted work from an interrupted session
- Context: on starting task-09, the working tree already contained a near-complete implementation (MobileMenu.jsx, tab-bar BuilderPage, mobile Navbar, 100dvh layouts, 44px touch targets, stacking Footer, and a `ui/smoke.mjs` Playwright verification script) that matched the task's scope but had never been committed — the task-09 workflow (verify → progress.md → actions.md → commit → push) had not been closed out.
- Decision: reviewed every changed file against the task's acceptance criteria, ran `npm run build` (passes), and re-ran the Playwright smoke script (adapted to this session's scratchpad path) live against the dev server to confirm no horizontal overflow at any of the six required widths, working tab-switch with dirty-dot indicator, chat state preserved across tabs, and correct rendering in both themes (dark mode spot-checked separately at 375px) before treating the task as verified. Deleted `ui/smoke.mjs` and the ad hoc dark-mode script afterward since Playwright isn't an approved/listed dependency and one-off verification scripts with hardcoded session-specific temp paths aren't shipped app code.
- Alternatives considered: re-implementing from scratch to be safe — rejected as pure waste; the existing diff was read in full and independently verified against every line of the task's acceptance criteria rather than trusted blindly.
- Review needed: no.

## [2026-07-14] task-10 — Contrast audit results (WCAG AA, both themes)
- Context: task's acceptance criteria require every text/background token pair to be checked against WCAG AA (4.5:1 body, 3:1 large/graphical) in both themes, with results logged here.
- Method: computed relative luminance (sRGB → linear, ITU-R BT.709 weights) and contrast ratio for every `--text`/`--text-muted`/`--danger`/`--success` value against every `--bg`/`--surface`/`--surface-2` value actually used as that pairing in the codebase (grepped `text-danger`/`text-success`/`text-primary`/`text-accent` usage sites first, then computed ratios only for pairs that occur in real components).
- Results (light theme):
  - `--text` #1F2328 vs `--bg`/`--surface`/`--surface-2`: 14.65:1 / 15.83:1 / 13.54:1 — pass.
  - `--text-muted` #5C6570 vs same three: 5.47:1 / 5.92:1 / 5.06:1 — pass.
  - `--danger` #C0392B (used as small text — form errors, logout, chat error banner) vs `--bg`/`--surface`/`--surface-2`: 5.03:1 / 5.44:1 / 4.65:1 — pass, narrowest margin on `--surface-2`.
  - `--success` #3B8C40 (used as `DownloadButton`'s "Done" label, real text) vs `--surface` (white): **4.19:1 — fails 4.5:1 AA.** Fixed by darkening to `#2C7530` (new ratios: 5.69:1 / 5.26:1 vs `--surface`/`--bg`, 4.86:1 vs `--surface-2`) — see fix below.
- Results (dark theme):
  - `--text` #E4E7EB vs `--bg`/`--surface`/`--surface-2`: 14.63:1 / 12.89:1 / 13.95:1 — pass.
  - `--text-muted` #9AA4B2 vs same three: 7.19:1 / 6.34:1 / 6.86:1 — pass.
  - `--danger` #E57368 vs same three: 6.04:1 / 5.32:1 / 5.75:1 — pass.
  - `--success` #4CAF6E vs same three: 6.62:1 / 5.84:1 / 6.31:1 — pass, no change needed.
- Graphical/icon-only uses of `--accent`/`--primary` as a background under `--primary-contrast` (avatar badges, icon circles) were checked against the 3:1 non-text threshold, not 4.5:1, since they're decorative glyphs, not text — all pass (worst case light `--accent` bg vs white icon glyph: 3.37:1).
- Review needed: no — light `--success` fix applied and reverified.

## [2026-07-14] task-10 — Darkened light-theme `--success` token from #3B8C40 to #2C7530
- Context: contrast audit above found the only real failure — `DownloadButton.jsx`'s `text-xs` "Done" success label only reached 4.19:1 against `--surface` (white), below the 4.5:1 AA floor for normal-size text.
- Decision: darkened `--success` in `:root` (light theme only — dark theme's `--success` already passed) to `#2C7530`, verified via the same luminance formula to clear 4.5:1 against `--bg`, `--surface`, and `--surface-2` with margin (4.86:1 worst case). Still reads clearly as a "success green," just a richer shade. Dark theme's `--success` (#4CAF6E) was left unchanged — it already passed everywhere it's used.
- Alternatives considered: adding a separate `--success-text` token distinct from the icon-fill `--success` — rejected as unnecessary complexity; one token that passes AA everywhere it's actually used is simpler than two tokens to track.
- Review needed: no.

## [2026-07-14] task-10 — Session-expired screen built on top of already-scaffolded AuthContext state
- Context: `AuthContext.jsx` already exposed `sessionExpired`/`clearSessionExpired` (set when `client.js`'s `apiRequest` sees a real `401`), but nothing consumed them — a mid-session 401 just silently cleared `user` and `ProtectedRoute` redirected straight to `/login` with no explanation, and the task requires "nice 401 handling ... preserving no data loss messaging."
- Decision: `ProtectedRoute.jsx` now branches on `sessionExpired` before falling back to the plain `<Navigate>` redirect, showing a card with a warning icon, "Session expired" heading, reassuring copy ("Nothing is lost — your resume and conversation are saved..." — true, since mock conversation state persists in `sessionStorage` per the task-04 decision above), and a "Sign in again" button that clears the flag and navigates to `/login`.
- Verification caveat: in mock mode, `unauthorizedHandler` is only ever invoked from `client.js`'s `apiRequest` (real `fetch` 401 responses) — mock mode's `src/api/mock.js` functions are called directly and never go through `apiRequest`, so this screen is currently unreachable via normal mock-mode usage (the only 401s mock.js throws are on `login`/`getSession`, handled separately by `AuthContext`'s initial-mount `.catch`, not this path). Verified correctness by temporarily exposing a one-line debug trigger (`window.__TEMP_TRIGGER_401`) in `client.js`, driving it live with Playwright to confirm the screen renders correctly and "Sign in again" clears state and returns to `/login`, then fully reverting the debug line before committing (confirmed via `git diff` showing zero changes to `client.js`). This path will become naturally reachable once a real backend returns actual 401s.
- Alternatives considered: building a mock-mode-only simulated expiry (e.g., auto-expire after N minutes) — rejected as speculative behavior not asked for by the task and not representative of the real backend's expiry semantics.
- Review needed: yes — once the real backend exists, do a live (non-simulated) pass confirming a genuine session expiry mid-chat triggers this screen end to end.

## [2026-07-14] task-10 — Logged, not fixed: two intentional hardcoded-color exceptions
- Context: task-10's consistency-pass scope says components should use `var(--*)` tokens, never hardcoded hex, but two spots intentionally deviate.
- Decision: left both as-is. (1) `LoginPage.jsx`'s "Continue with Google" button uses `bg-white`/`text-gray-800`/`hover:bg-gray-50` regardless of theme — this isn't drift, it's Google's Sign-In branding guidelines, which mandate a fixed white button regardless of host app theme. (2) `ResumePreview.jsx`'s near-black `#111111`/`#3a3a3a` text and `bg-white` container are required by CLAUDE.md §5 itself ("resume preview page is ALWAYS white with dark text, in both modes ... near-black #111 ... navy headings"), so the resume document intentionally does not participate in the `--*` token system.
- Review needed: no.

## [2026-07-14] task-10 — OG image is an SVG placeholder, not a raster PNG
- Context: task asks for "a simple OG image or solid-color branded placeholder." No image-generation tooling/dependency is approved or available in this environment.
- Decision: hand-built `ui/public/og-image.svg` (1200×630, navy `--primary` background, favicon-style icon mark, "ResumeChat" wordmark) referenced via `og:image`/`twitter:image` in `index.html`. Some older social-card scrapers (notably Facebook's) don't render SVG `og:image`s reliably — this is a known limitation, not an oversight.
- Alternatives considered: skipping OG image entirely — rejected, task explicitly asks for one and a branded placeholder is better than nothing for the platforms that do support SVG (Slack, Discord, LinkedIn, X/Twitter with `summary_large_image`).
- Review needed: yes — swap for a real PNG/JPG export of this SVG (or a designed asset) once the app has a production domain, for maximum social-scraper compatibility.

## [2026-07-14] task-11 — Closing summary: what a human reviewer should look at first

All 11 tasks are complete. Every entry above has a Context/Decision/Alternatives/Review-needed
breakdown; the ones flagged `Review needed: yes` are the substantive judgment calls, not busywork —
here's the priority order for a first pass:

1. **The backend is unimplemented** (task-03, task-04, task-08, and "Backend change requests"
   below). This is the single biggest thing: the entire UI — auth, chat, file downloads — was
   built and verified against `src/api/mock.js`, not a real API. `docs/api-contract.md` documents
   the *assumed* contract; someone needs to implement the backend routes and then verify/correct
   that document against what actually gets built, especially the auth mechanism (cookie session
   was a guess, not a discovered fact — task-03) and whether PDF/DOCX generation should move
   server-side eventually (task-08).
2. **Session-expired screen is logic-verified but not live-verified** (task-10) — mock mode has no
   code path that produces a genuine mid-session 401, so this was confirmed correct via a
   temporary debug hook (fully reverted, confirmed via `git diff`) rather than organic use. Worth
   a real pass once the backend exists.
3. **Register/account creation is a stub** (task-03) — toggles a local form mode, reuses the login
   mock function, and accepts any credentials. Needs a real decision on whether registration is
   even in scope for this product.
4. **Two intentional hardcoded-color exceptions** (task-10) — the Google sign-in button and the
   resume preview document. Both are deliberate (external brand guideline / explicit CLAUDE.md
   requirement respectively), not drift, but worth a quick sanity check.
5. **OG image is a hand-built SVG, not a raster export** (task-10) — works on most modern social
   scrapers but not universally; swap for a PNG once there's a production domain to design against.

Nothing else in this log needs review before merge — the rest are self-contained implementation
choices (mock storage strategy, code-splitting, breakpoint values, etc.) that don't depend on
information only a human has.

---

## Backend change requests
Things the backend should change or add. The UI must not modify backend code — list requests here instead.

- **[2026-07-13] Backend is unimplemented.** `app.py` has no routers registered; `controller/auth.py`, `controller/resume.py`, `models/*.py`, `services/*.py`, `database/db.py`, `config/settings.py` are all empty. The UI was built entirely against the assumed contract in `ui/docs/api-contract.md` (cookie-session auth, server-redirect Google OAuth). Needed before the UI can run against a real backend:
  - `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/google`, `GET /api/me` — session-cookie based, CORS configured with `Access-Control-Allow-Credentials: true` and an explicit allowed origin (not `*`) so cookies work cross-origin during local dev (`http://localhost:5173` → API base URL).
  - `POST /api/chat` implementing the scripted interview (contact → target role → experience → education → skills), returning `{ reply, resume, completeness, suggestions? }` matching `ui/docs/api-contract.md`.
  - `GET /api/resume/:id/pdf` and `/docx` for file generation, OR confirmation that client-side generation (Task 08) is the intended long-term approach.
