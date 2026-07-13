# Task 02 — App shell: navbar, footer, routing

## Objective
Build the application frame: navbar, footer, route structure, and the empty split-screen builder layout.

## Scope
- React Router v6: routes `/login`, `/` (builder), `*` (404 page)
- `src/components/layout/Navbar.jsx`:
  - Left: logo mark (rounded square in `--primary` with a document icon) + "ResumeChat" wordmark; nav links: Builder, My resumes (link can be non-functional for now)
  - Right: resume completeness pill (progress bar + "N% complete", reads a placeholder value for now), theme toggle button (sun/moon/system icon), user avatar menu placeholder (wired in Task 03)
  - Height ~56px, bottom hairline border `--border`, background `--surface-2` in dark / `--surface` in light
- `src/components/layout/Footer.jsx`: "© 2026 ResumeChat", Privacy, Terms, GitHub icon link. Non-sticky; sits below content. Compact (~48px).
- `src/components/layout/AppLayout.jsx`: navbar + `<Outlet/>` + footer; builder page fills remaining viewport height (`min-h-[calc(100vh-...)]`)
- `src/pages/BuilderPage.jsx`: split grid — left chat placeholder panel, right preview placeholder panel, vertical hairline divider. Placeholders clearly labeled.
- 404 page: minimal, styled, link back to `/`
- Login page renders WITHOUT navbar/footer (separate layout route)

## Acceptance criteria
- Navigating between `/`, `/login`, and a bad URL shows correct layouts
- Navbar/footer look correct in both themes; all icon buttons have `aria-label`
- Builder page split layout fills the viewport with no page-level scrollbar at 1280px
- Build passes; nothing outside `/ui` touched

## Done =
progress.md updated → commit `task-02: app shell with navbar, footer and routing` → push
