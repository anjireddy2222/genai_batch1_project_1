# API contract

**Status: assumed / provisional.** The backend at the repo root has no implemented routes yet
(see `ui/actions.md`, task-03 entry and "Backend change requests"). Every endpoint below is the
contract the UI is built against — sourced from `CLAUDE.md` §6 — and mirrored exactly by
`src/api/mock.js` so the UI is fully testable today. When the backend is implemented, correct
this file to match reality and update `src/api/*.js` accordingly.

Base URL: `VITE_API_BASE_URL` (see `.env.example`). Mock mode: `VITE_USE_MOCKS=true` bypasses
network calls entirely and uses `src/api/mock.js`.

Auth mechanism: **httpOnly cookie session** (`credentials: 'include'` on every request). Chosen
as the default per CLAUDE.md's fallback instruction since the backend doesn't yet reveal its
mechanism. Google OAuth is a **server redirect flow**: the UI navigates the browser to
`GET /api/auth/google`, the backend handles the provider round-trip and redirects back with a
session cookie set.

---

## `POST /api/auth/login`

Request:
```json
{ "email": "jane@example.com", "password": "hunter2" }
```

Response `200`:
```json
{ "user": { "id": "u_1", "name": "Jane Doe", "email": "jane@example.com" } }
```

Response `401`:
```json
{ "status": 401, "message": "Invalid email or password" }
```

Session cookie is set by the backend on success. No token is returned to the client.

## `GET /api/auth/google`

Not a fetch call — the UI sets `window.location.href` to this URL. Backend handles the OAuth
round trip and redirects back to the app with a session cookie set.

## `POST /api/auth/logout`

Response `204`. Clears the session cookie server-side.

## `GET /api/me`

Response `200`:
```json
{ "user": { "id": "u_1", "name": "Jane Doe", "email": "jane@example.com" } }
```

Response `401` when not authenticated (no body needed beyond the normalized error shape).

---

## `POST /api/chat`

Request:
```json
{ "message": "I want to be a product manager", "conversationId": "c_1" }
```

`conversationId` is `null` on the very first message; the server creates one and returns it in
the response.

Response `200`:
```json
{
  "conversationId": "c_1",
  "turnId": 4,
  "reply": "Great — let's talk about your most recent role. What was your title and where did you work?",
  "suggestions": ["Looks good", "Edit this"],
  "resume": {
    "name": "Jane Doe",
    "contact": { "email": "jane@example.com", "phone": "", "location": "" },
    "targetRole": "Product Manager",
    "summary": "",
    "experience": [],
    "education": [],
    "skills": []
  },
  "completeness": 25
}
```

- `turnId` increments per assistant reply; the UI ignores any response whose `turnId` is not
  greater than the latest one it has applied (guards against out-of-order responses).
- `suggestions` is optional; when present the UI renders quick-reply chips under the message.
- `resume` is the full, current resume state (not a diff); the UI computes what changed for the
  highlight animation.
- `completeness` is `0-100`; `100` unlocks downloads.

## `GET /api/conversation` (session restore)

Response `200`:
```json
{
  "conversationId": "c_1",
  "messages": [{ "role": "assistant", "text": "Hi! Let's build your resume...", "turnId": 1 }],
  "resume": { "...": "same shape as above" },
  "completeness": 25
}
```

Response `404` when no conversation exists yet — the UI starts fresh and sends an empty first
message to get the greeting.

---

## Resume file downloads — generated client-side, not a backend endpoint

`GET /api/resume/:id/pdf` and `/docx` were assumed in CLAUDE.md §6, but the backend has no
route for either (see "Backend change requests" below) — there was nothing to call. As decided
in Task 08 (see `actions.md`), the UI generates both files entirely client-side from the current
`resume` state already held by `ResumeContext`, using `@react-pdf/renderer` (PDF) and `docx`
(DOCX), styled to match `ResumePreview.jsx`. No network request is made for downloads in either
mock or real-backend mode. If the backend later adds real generation endpoints, `DownloadButton.jsx`
is the single place that would switch from local generation to a `fetch` + blob download.

---

## Error shape

Every non-2xx response is normalized by `src/api/client.js` to:
```json
{ "status": 401, "message": "Human-readable message" }
```
The UI never renders raw error strings from the network.
