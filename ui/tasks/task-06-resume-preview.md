# Task 06 — Live resume preview

## Objective
The right half of the builder: a faithful, always-light document preview rendered from the resume JSON.

## Scope
- `src/components/preview/ResumePreview.jsx` renders the resume object from state
- **Document styling is fixed and theme-independent** (CLAUDE.md §5): white page, `#111` text, Georgia name (17–18px), Arial body (~10.5–11px), navy `#1E3A5F` UPPERCASE section headings with 1px navy rule, single column, generous margins. Page has subtle rounded corners and sits on `--surface-2` panel background with a slight border.
- Sections: header (name, contact line with · separators), Summary, Work Experience (title — company, dates · location, bullet list), Education, Skills (comma-separated line — ATS-safe, no pill tags on the document itself)
- Empty/unfilled sections render as soft gray skeleton bars so the document looks like it's taking shape
- Panel header row above the page: "Live preview" label + PDF / DOCX buttons (disabled until Task 08 wires them; tooltip "Available when your resume is complete")
- ATS reassurance line under the page: check icon + "ATS check: single column, standard headings, parseable fonts"
- Overflow: the page scrolls within its panel; the panel itself never causes page-level scroll at desktop sizes

## Acceptance criteria
- Feeding progressively fuller resume JSON (via mock conversation) renders correctly at every stage — empty, partial, complete
- Preview page is identical in light and dark app themes
- Very long names, many jobs, long bullets: layout holds
- Build passes

## Done =
progress.md updated → commit `task-06: live resume preview` → push
