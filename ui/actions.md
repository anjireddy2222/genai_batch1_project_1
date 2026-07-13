# Actions log

Claude Code records every autonomous decision here for later human review.
Format per entry:

```
## [YYYY-MM-DD] task-NN — <decision title>
- Context: why a decision was needed
- Decision: what was done
- Alternatives considered: brief
- Review needed: yes / no
```

Examples of things that MUST be logged: adding a dependency, deviating from a task file,
correcting the assumed API contract after reading backend code, choosing cookie vs JWT auth
handling, skipping or re-ordering a task, any workaround for a backend limitation.

---

(no entries yet)

---

## Backend change requests
Things the backend should change or add. The UI must not modify backend code — list requests here instead.

(none yet)
