---
"@onkernel/managed-auth-react": minor
---

Add the `AWAITING_HUMAN_INTERVENTION` step. When a connection has `hitl` enabled and the login hits a CAPTCHA the browser cannot solve, the component embeds the login browser's live view so the person can complete it, then resumes the login when they confirm. If the site asks for another check after the person continues, the screen shows a short note. Sites that restrict embedded content with a Content-Security-Policy need to allow the live view origin in `frame-src`.
