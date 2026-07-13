# ResumeChat — AI Resume Builder (UI)

A single-page application where users build an ATS-friendly resume by chatting with an AI. No forms. The AI collects data conversationally, a live resume preview updates in real time, and users download PDF and DOCX files.

This file governs ALL work in this repository. Read it fully at the start of every session.

---

## 1. Hard rules — never violate these

1. **Work ONLY inside the `/ui` folder.** The repository root contains the backend. You may READ backend code to understand API contracts, but you must NEVER modify, create, delete, move, or reformat any file outside `/ui`. Not even whitespace. If a backend change seems necessary, log it in `ui/actions.md` under "Backend change requests" and work around it in the UI.
2. **Plain JavaScript only.** No TypeScript, no `.ts`/`.tsx` files, no JSDoc type-checking setup.
3. **One task at a time**, in the order defined in `ui/progress.md`. Complete the full workflow (Section 7) for a task before starting the next.
4. **Never wait for approval.** When a decision is needed, take the most sensible action and log it in `ui/actions.md` (Section 8). Keep moving.
5. **Commit and push after every completed task.** Never batch multiple tasks into one commit.
6. **Do not add dependencies beyond the approved list** (Section 4) without logging the reason in `actions.md`.

## 2. Product overview

- **Layout:** split screen. Left: chat panel. Right: live resume preview. Header navbar on top, footer below.
- **Flow:** user logs in → AI greets and interviews them (contact → target role → experience → education → skills) → AI rewrites rough answers into strong, quantified ATS bullets → preview fills in live → user downloads PDF/DOCX.
- **Auth:** email/password login + "Continue with Google", logout, protected routes.
- **The backend owns all intelligence and data.** The UI renders state the backend returns; it never computes resume content itself.

## 3. Tech stack

- Vite + React 18 (JavaScript)
- React Router v6
- Tailwind CSS (class-based dark mode: `darkMode: 'class'`)
- Fetch API via a single client module (`src/api/client.js`)
- Fonts: **Inter** (400/500/600) from Google Fonts for all UI. Resume preview uses Georgia (name) + Arial (body) inline.

## 4. Approved dependencies

`react`, `react-dom`, `react-router-dom`, `tailwindcss` (+ postcss/autoprefixer), `@tabler/icons-react` (icons). Nothing else without an `actions.md` entry explaining why.

## 5. Design system — premium, professional, world-class

The bar: this should look like a polished commercial SaaS product, not a tutorial project. Precision in spacing, restraint in decoration. No gradients, no glow effects, no emoji in UI. Generous whitespace. Every interactive element has hover, focus-visible, active, and disabled states.

### Color tokens

Define BOTH palettes as CSS variables in `src/index.css`. Components use `var(--*)` (or Tailwind classes mapped to them) — never hardcoded hex values in components.

```css
:root {
  --bg: #F7F6F3;          /* page background */
  --surface: #FFFFFF;      /* cards, panels, AI bubbles */
  --surface-2: #EFEDE8;    /* subtle raised areas */
  --primary: #1E3A5F;      /* buttons, user bubbles, links */
  --primary-contrast: #FFFFFF;
  --accent: #2D9C8A;       /* AI identity: typing dots, highlights, progress */
  --success: #3B8C40;
  --danger: #C0392B;
  --text: #1F2328;
  --text-muted: #5C6570;
  --border: #E2E0DA;
}
.dark {
  --bg: #12161C;
  --surface: #1C222B;
  --surface-2: #161B22;
  --primary: #5B8DC9;
  --primary-contrast: #0D1420;
  --accent: #3FBFA8;
  --success: #4CAF6E;
  --danger: #E57368;
  --text: #E4E7EB;
  --text-muted: #9AA4B2;
  --border: #2A3340;
}
```

### Theme rules

- Three-way toggle: light / dark / system. Persist in `localStorage` key `theme`.
- Inline script in `index.html` applies the `dark` class before first paint (no flash of wrong theme).
- **The resume preview page is ALWAYS white with dark text, in both modes.** It is a document preview, not UI.

### Signature interaction

When the AI adds content to the resume, the new element in the preview flashes a soft `--accent` tint highlight (~1.2s fade). This is the product's memorable moment — implement it carefully and make sure it respects `prefers-reduced-motion`.

### Typography and spacing

- UI: Inter. Body 15–16px / 1.6. Headings weight 600, tight letter-spacing (-0.01em).
- Resume preview: Georgia 17px name; Arial ~10.5–11px body; near-black `#111`; navy `#1E3A5F` headings + 1px rule lines only. Single column. Never colored body text.
- Spacing scale: multiples of 4px. Radius: 8px controls, 12px cards.
- Respect `prefers-reduced-motion` for all animation.

## 6. Backend API

The backend lives at the repo root and is READ-ONLY reference. Before Task 05, inspect its route definitions and record the real contract in `ui/docs/api-contract.md`.

Assumed shape (verify and correct against the actual backend — log corrections in `actions.md`):

- `POST /api/auth/login` `{email, password}` → sets session / returns token
- `GET /api/auth/google` → OAuth redirect flow
- `POST /api/auth/logout`
- `GET /api/me` → `{ user }` or 401
- `POST /api/chat` `{ message, conversationId }` → `{ reply, resume, completeness }`
- `GET /api/resume/:id/pdf` and `/docx` → file downloads

Base URL from `VITE_API_BASE_URL` in `.env` (provide `.env.example`). If the backend uses httpOnly cookies, use `credentials: 'include'`; if it returns a JWT, store in localStorage and send `Authorization: Bearer`. Detect which from the backend code and log the finding.

**Mock mode:** implement `src/api/mock.js` mirroring the contract, enabled via `VITE_USE_MOCKS=true`, so every UI task is testable without the backend running.

## 7. Workflow — every task, in order

1. Read `ui/progress.md`; pick the first task with status `todo`. Set it to `in-progress` (commit this change with the task's final commit).
2. Read the task file in `ui/tasks/`. Read this CLAUDE.md if it's a new session.
3. Implement. Verify acceptance criteria: run `npm run dev`, check both themes, check mobile width (375px), check console for errors. Run `npm run build` — it must pass.
4. Update `ui/progress.md`: status `done`, date, one-line summary.
5. Log any autonomous decisions in `ui/actions.md`.
6. Commit ALL changes: `git add` (only files under `ui/`), commit message `task-NN: <short description>`, then `git push`.
7. Move to the next task.

If a task fails or is blocked: set status `blocked` in progress.md with the reason, log details in actions.md, and continue to the next unblocked task.

## 8. actions.md logging format

```
## [date] task-NN — <decision title>
- Context: why a decision was needed
- Decision: what was done
- Alternatives considered: brief
- Review needed: yes/no
```

Also maintain a "Backend change requests" section at the bottom for anything the backend team should change (CORS, missing endpoints, response shape issues).

## 9. Quality checklist (applies to every task)

- Works in light AND dark mode
- Responsive: 375px, 768px, 1280px. Below 900px the split screen collapses to Chat/Preview tabs
- Keyboard accessible, visible focus rings, semantic HTML, labelled icon buttons
- Loading, empty, and error states for anything async
- No console errors/warnings; `npm run build` passes
- No file outside `/ui` touched (verify with `git status` before committing)
