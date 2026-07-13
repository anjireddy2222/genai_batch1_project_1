# Task 05 — Chat panel

## Objective
The left half of the builder: a polished, production-quality chat experience.

## Scope
- `src/components/chat/ChatPanel.jsx` — owns message list state, calls the API layer
- `MessageBubble.jsx`:
  - AI: left-aligned, `--surface` bubble, small round `--accent` avatar with sparkle icon, top-left corner squared (4px)
  - User: right-aligned, `--primary` bubble with `--primary-contrast` text, top-right corner squared
  - AI suggestion blocks (rewritten bullets) render inside the bubble as a left-border `--accent` quote block
  - Max bubble width ~85%; comfortable 1.55 line height
- `TypingIndicator.jsx`: three animated dots in an AI bubble while awaiting a reply (respect reduced motion)
- `ChatInput.jsx`: auto-growing textarea (max ~5 rows), Enter sends / Shift+Enter newline, circular send button in `--primary`, disabled while a reply is pending
- Quick-reply chips: if the API response includes `suggestions: []`, render tappable chips under the last AI message (e.g. "Looks good", "Edit this")
- Auto-scroll to newest message; do NOT yank scroll if the user has scrolled up (show a "jump to latest" pill instead)
- Welcome state: first AI greeting appears on load via the API
- Error state: failed send shows an inline retry affordance on the message

## Acceptance criteria
- Smooth multi-turn conversation against mocks; no layout shift when the typing indicator appears
- Keyboard-only operation works end to end
- Long messages, long words, and rapid sends don't break layout
- Both themes correct; build passes

## Done =
progress.md updated → commit `task-05: chat panel` → push
