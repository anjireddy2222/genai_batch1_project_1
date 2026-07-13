# Task 07 — Chat ↔ resume integration

## Objective
Wire the two panels together into the product's core loop, including the signature highlight moment and the completeness indicator.

## Scope
- Lift state: `BuilderPage` (or a `ResumeContext`) owns `{ messages, resume, completeness, conversationId }`; every chat response updates all of it atomically
- **Signature interaction:** diff the incoming resume object against the previous one; newly added/changed preview elements flash a soft `--accent` background tint fading over ~1.2s. Respect `prefers-reduced-motion` (fall back to no animation). This is the demo's wow moment — make it feel precise, not flashy.
- Navbar completeness pill now reads real `completeness` from state; animate width changes smoothly
- Auto-scroll the preview to the section that just updated (only if the user isn't actively scrolling it)
- Session restore: on load, fetch existing conversation + resume if the backend/mocks support it; otherwise start fresh (log the decision)
- Handle out-of-order/failed responses without corrupting state (ignore stale responses by conversation turn id)

## Acceptance criteria
- Full mock interview start-to-finish: every AI reply visibly updates the preview with the highlight effect and advances the completeness bar
- Rapid consecutive messages don't cause flicker or stale-state bugs
- Reduced-motion mode shows updates without animation
- Both themes; build passes

## Done =
progress.md updated → commit `task-07: chat and resume state integration` → push
