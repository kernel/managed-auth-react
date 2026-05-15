---
"@onkernel/managed-auth-react": patch
---

Guard the bootstrap effect in `useManagedAuthSession` against React 18+ Strict Mode's mount → cleanup → mount double-invocation. Without the guard, the second mount re-fires `exchangeHandoffCode` with a now-consumed handoff code and the component lands in the error state ("Failed to start session") even when auth would have worked. Tracked per `(sessionId, handoffCode)` so a genuine prop change still triggers a fresh exchange.
