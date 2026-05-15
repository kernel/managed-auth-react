# @onkernel/managed-auth-react

## 0.3.0

### Minor Changes

- [#13](https://github.com/kernel/managed-auth-react/pull/13) [`fc77370`](https://github.com/kernel/managed-auth-react/commit/fc773706772e29932ed971c3d3fbeab6833c4bb8) Thanks [@masnwilliams](https://github.com/masnwilliams)! - Auto-resolve SSO provider icons via the Simple Icons CDN. `getSSOProviderInfo` now slugifies any provider key and renders its brand icon from `https://cdn.simpleicons.org/<slug>`, with a circular letter-avatar fallback when the icon fails to load. Removes the hardcoded `GoogleMark` / `GitHubMark` / `GitLabMark` / `MicrosoftMark` / `FacebookMark` / `AppleMark` SVGs in favor of the generic resolver, so new providers render out of the box without library changes. Non-brand keys (`passkey`, `sso`, `saml`) keep their built-in icons.

### Patch Changes

- [#10](https://github.com/kernel/managed-auth-react/pull/10) [`74f27bc`](https://github.com/kernel/managed-auth-react/commit/74f27bcd366fda00c42b1cba3cd2a42ff9d5e217) Thanks [@Tom-Achache](https://github.com/Tom-Achache)! - Guard the bootstrap effect in `useManagedAuthSession` against React 18+ Strict Mode's mount → cleanup → mount double-invocation. Without the guard, the second mount re-fires `exchangeHandoffCode` with a now-consumed handoff code and the component lands in the error state ("Failed to start session") even when auth would have worked. Tracked per `(sessionId, handoffCode)` so a genuine prop change still triggers a fresh exchange.

- [#13](https://github.com/kernel/managed-auth-react/pull/13) [`fc77370`](https://github.com/kernel/managed-auth-react/commit/fc773706772e29932ed971c3d3fbeab6833c4bb8) Thanks [@masnwilliams](https://github.com/masnwilliams)! - Wrap button and option text when content overflows. `.kma-button` previously used `white-space: nowrap` and a fixed `height`, so long MFA / SSO / sign-in option labels clipped past the card on narrower viewports. Switched to `min-height` plus `overflow-wrap: anywhere` so labels wrap and the row grows to fit, and added `padding` + `min-width: 0` on `.kma-sso-button` so its label can shrink.
