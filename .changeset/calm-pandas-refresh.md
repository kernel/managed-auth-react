---
"@onkernel/managed-auth-react": patch
---

Preserve input-ready session state when skipping the prime step and refresh discovery state after 15 seconds without updates. Ignore reconnect responses superseded by newer state or a submission so they cannot hide ready fields or incorrectly expire the session.
