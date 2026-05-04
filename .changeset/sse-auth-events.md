---
"@onkernel/managed-auth-react": minor
---

Subscribe to managed auth state via the `/auth/connections/{id}/events` SSE endpoint instead of polling `/auth/connections/{id}` every 2s. Removes the post-submit race where the UI could briefly snap back to `awaiting_input` after submission.
