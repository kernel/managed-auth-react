---
"@onkernel/managed-auth-react": minor
---

Render MFA alternatives on the external action waiting screen. When the backend sends `mfa_options` alongside an `AWAITING_EXTERNAL_ACTION` event (e.g. "Try another way"), the UI now renders those options so users can switch to an alternative verification method instead of waiting for a push notification.
