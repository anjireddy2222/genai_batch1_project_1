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

---

## Backend change requests
Things the backend should change or add. The UI must not modify backend code — list requests here instead.

- **[2026-07-13] Backend is unimplemented.** `app.py` has no routers registered; `controller/auth.py`, `controller/resume.py`, `models/*.py`, `services/*.py`, `database/db.py`, `config/settings.py` are all empty. The UI was built entirely against the assumed contract in `ui/docs/api-contract.md` (cookie-session auth, server-redirect Google OAuth). Needed before the UI can run against a real backend:
  - `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/google`, `GET /api/me` — session-cookie based, CORS configured with `Access-Control-Allow-Credentials: true` and an explicit allowed origin (not `*`) so cookies work cross-origin during local dev (`http://localhost:5173` → API base URL).
  - `POST /api/chat` implementing the scripted interview (contact → target role → experience → education → skills), returning `{ reply, resume, completeness, suggestions? }` matching `ui/docs/api-contract.md`.
  - `GET /api/resume/:id/pdf` and `/docx` for file generation, OR confirmation that client-side generation (Task 08) is the intended long-term approach.
