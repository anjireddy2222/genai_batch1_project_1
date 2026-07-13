# Task 03 — Authentication

## Objective
Login page (email/password + Google), auth context, protected routes, logout via the navbar user menu.

## Pre-work (required)
Read the backend's auth routes at the repo root (READ ONLY). Determine:
1. Exact endpoint paths and payloads for login, logout, session check, Google OAuth
2. Session mechanism: httpOnly cookie vs returned JWT
3. Google flow: server redirect (`window.location.href = <backend google url>`) vs client token exchange

Record findings in `ui/docs/api-contract.md` and log the decision in `actions.md`. If the backend is ambiguous, default to: cookie sessions + server redirect flow, and note it under "Backend change requests" if unsupported.

## Scope
- `src/context/AuthContext.jsx`: `{ user, loading, login(email, pw), logout() }`. On mount, calls session-check endpoint; `loading` guards against login-page flash for authed users.
- `src/pages/LoginPage.jsx` (match the approved mockup):
  - Centered card on `--bg`; logo + tagline "Chat your way to a job-ready resume"
  - "Continue with Google" button (white, Google icon), divider "or", email + password fields (password show/hide toggle), primary "Sign in" button, "Create an account" link (route can be a stub or the same form in register mode if the backend supports it — decide and log)
  - Inline validation + error banner for failed login (never raw error strings)
  - Loading spinner state on submit; disable double-submit
- `src/components/auth/ProtectedRoute.jsx`: redirects to `/login` when unauthenticated (after `loading` resolves); logged-in users visiting `/login` redirect to `/`
- Navbar user menu (dropdown): avatar with initials in `--accent`, name; menu shows name/email, Profile (stub), Log out (danger color). Closes on outside click and Escape.
- Logout: call backend, clear context, redirect to `/login`

## Acceptance criteria
- Full flow works against mock mode (Task 04 delivers mocks — for now stub `api/auth.js` with in-memory fake responses and mark it clearly)
- Refresh while logged in does NOT flash the login page
- Dropdown is keyboard accessible (Tab, Enter, Escape)
- Both themes correct; build passes

## Done =
progress.md updated → commit `task-03: authentication with google login` → push
