# Task 09 — Responsive & mobile experience

## Objective
Make the whole app feel native on phones and tablets, not merely "not broken".

## Scope
- Breakpoints: desktop ≥1280px (full split), laptop 900–1279px (split with narrower preview), below 900px the builder collapses to a **tab bar: Chat | Preview** (segmented control under the navbar; preserve state when switching; show a small dot on the Preview tab when it updated while hidden)
- Mobile navbar: logo + completeness pill (compact) + hamburger/user avatar; nav links and theme toggle move into the menu
- Login page: card becomes full-width with side padding at <480px
- Chat on mobile: input stays above the on-screen keyboard (`100dvh` layout, avoid `100vh` bugs), bubbles max-width ~88%, touch targets ≥44px
- Preview on mobile: page scales to fit width (CSS `transform: scale` wrapper or fluid sizing) — the document must still look like a document
- Footer: stacks vertically at small widths
- Test at 375px, 390px, 768px, 1024px, 1280px, 1536px

## Acceptance criteria
- No horizontal scrolling at any test width
- Tab switch on mobile is instant and stateful; the "updated" dot works
- Sending a message with the keyboard open doesn't hide the input or jump the page
- Both themes; build passes

## Done =
progress.md updated → commit `task-09: responsive and mobile experience` → push
