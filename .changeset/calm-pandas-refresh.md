---
"@onkernel/managed-auth-react": patch
---

Preserve input-ready session state when skipping the prime step and refresh discovery state after 15 seconds without updates. Share snapshot recovery across discovery, reconnects, and stale submissions; reconcile overlapping live updates instead of discarding potentially newer state, and cancel obsolete requests when submitting or leaving a session.
