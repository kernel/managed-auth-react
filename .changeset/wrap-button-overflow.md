---
"@onkernel/managed-auth-react": patch
---

Wrap button and option text when content overflows. `.kma-button` previously used `white-space: nowrap` and a fixed `height`, so long MFA / SSO / sign-in option labels clipped past the card on narrower viewports. Switched to `min-height` plus `overflow-wrap: anywhere` so labels wrap and the row grows to fit, and added `padding` + `min-width: 0` on `.kma-sso-button` so its label can shrink.
