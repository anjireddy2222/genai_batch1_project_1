# Task 10 — Polish, accessibility & QA

## Objective
Elevate from "working" to premium, and sweep the whole app for defects.

## Scope — polish
- Micro-interactions: button hover/active (subtle scale 0.98 on press), chip hover, smooth theme cross-fade on `--bg`/`--surface` (150ms), navbar dropdown open/close transition. All gated behind `prefers-reduced-motion`.
- Consistency pass: audit every spacing, radius, font size against CLAUDE.md §5; fix drift
- Favicon + `<title>` "ResumeChat — AI resume builder" + meta description + Open Graph tags (generate a simple OG image or solid-color branded placeholder)
- Empty states written as invitations (e.g. preview before login-in interview starts)
- Nice 401 handling: session expiry mid-chat shows a "Session expired — sign in again" screen preserving no data loss messaging

## Scope — accessibility
- Full keyboard pass: logical tab order, visible focus rings everywhere, Escape closes menus
- Screen reader pass: landmarks (`nav`, `main`, `footer`), `aria-live="polite"` on the message list for new AI replies, labels on all icon buttons and form fields
- Color contrast: verify every text/background pair in BOTH themes meets WCAG AA (4.5:1 body, 3:1 large); adjust token usage where needed and log changes

## Scope — QA sweep
- Console clean in all flows; React strict-mode warnings resolved
- Lighthouse (or equivalent reasoning pass) on performance basics: font `display=swap`, no oversized bundles, code-split the login route
- `npm run build` + preview the production build; verify env handling

## Acceptance criteria
- Zero console errors across: login → interview → download → logout, in both themes, desktop and 375px
- Documented contrast check results in the task's actions.md entry
- Build passes

## Done =
progress.md updated → commit `task-10: polish, accessibility and qa` → push
