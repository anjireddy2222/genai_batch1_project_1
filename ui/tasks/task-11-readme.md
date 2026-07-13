# Task 11 — README & portfolio presentation

## Objective
This is a portfolio project — the repo itself is a deliverable. Make `/ui` self-explanatory and impressive to a reviewer who spends 90 seconds on it.

## Scope
- `ui/README.md`:
  - One-paragraph pitch + hero screenshot (light and dark side by side)
  - Feature list with 3–4 screenshots or a short GIF of the signature moment (chat → preview highlight). If screenshot tooling isn't available, create a `docs/screenshots/` folder with a note listing exactly which screenshots the owner should capture.
  - Architecture section: split-screen SPA, state flow diagram (ASCII is fine), API contract link, mock mode explanation
  - Design system summary: both palettes as swatches (markdown table with hex), typography, the "resume stays light" decision and why
  - Getting started: prerequisites, `.env` setup, `npm i && npm run dev`, mock mode instructions
  - Tech decisions & tradeoffs section (JS over TS rationale, cookie vs JWT finding, client vs server file generation)
- Verify `ui/docs/api-contract.md` is current and linked
- Final review of `actions.md`: ensure every entry is complete; add a closing summary entry listing anything the owner should review first

## Acceptance criteria
- A stranger can clone, configure, and run the UI in mock mode using only the README
- README renders cleanly on GitHub (check relative image paths)

## Done =
progress.md updated → commit `task-11: readme and portfolio presentation` → push
