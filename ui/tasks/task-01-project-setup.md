# Task 01 — Project setup & theme system

## Objective
Scaffold the Vite + React (JavaScript) project inside `/ui` with Tailwind, fonts, design tokens, and a working light/dark/system theme system.

## Scope
- `npm create vite@latest` (React, **JavaScript** template) inside `/ui`
- Tailwind CSS configured with `darkMode: 'class'`; map Tailwind theme colors to the CSS variables from CLAUDE.md §5 (e.g. `primary: 'var(--primary)'`)
- `src/index.css`: both `:root` and `.dark` token blocks exactly as specified in CLAUDE.md
- Inter font (400/500/600) loaded from Google Fonts in `index.html`
- Inline script in `index.html` that reads `localStorage.theme` (light/dark/system) and applies the `dark` class before first paint
- `src/hooks/useTheme.js`: returns `{ theme, setTheme }`, persists choice, listens to `prefers-color-scheme` changes when in system mode
- Folder structure: `src/api/`, `src/components/`, `src/pages/`, `src/hooks/`, `src/context/`
- `.env.example` with `VITE_API_BASE_URL=` and `VITE_USE_MOCKS=true`
- `.gitignore` covering `node_modules`, `dist`, `.env`
- Temporary demo page showing token swatches + a theme toggle button to prove the system works (replaced in Task 02)

## Out of scope
Routing, navbar, auth, any real pages.

## Acceptance criteria
- `npm run dev` renders the demo page; toggling cycles light → dark → system with no flash on reload
- Refreshing in dark mode shows NO flash of light theme
- `npm run build` passes
- No files outside `/ui` created or modified

## Done =
progress.md updated → commit `task-01: project setup and theme system` → push
