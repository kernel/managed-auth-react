---
"@onkernel/managed-auth-react": patch
---

Prefer the canonical managed-auth awaiting-input contract (`fields` and `choices`) when present, while continuing to fall back to legacy `discovered_fields`, `pending_sso_buttons`, `mfa_options`, and `sign_in_options` during the deprecation window.
