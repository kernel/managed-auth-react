# @onkernel/managed-auth-react

## 0.5.4

### Patch Changes

- [#33](https://github.com/kernel/managed-auth-react/pull/33) [`c91e582`](https://github.com/kernel/managed-auth-react/commit/c91e5820bbbf82fb4f3117ef760f29143571b856) Thanks [@aylee855](https://github.com/aylee855)! - Preserve input-ready session state when skipping the prime step and refresh discovery state after 15 seconds without updates. Share snapshot recovery across discovery, reconnects, and stale submissions; reconcile overlapping live updates instead of discarding potentially newer state, and cancel obsolete requests when submitting or leaving a session.

- [#33](https://github.com/kernel/managed-auth-react/pull/33) [`c91e582`](https://github.com/kernel/managed-auth-react/commit/c91e5820bbbf82fb4f3117ef760f29143571b856) Thanks [@aylee855](https://github.com/aylee855)! - Keep an already-ready login form visible when the consent step is dismissed, instead of replacing it with a loading state that no later event will clear.

- [#36](https://github.com/kernel/managed-auth-react/pull/36) [`c354962`](https://github.com/kernel/managed-auth-react/commit/c354962710317375f22d407c80a82d478bbf2653) Thanks [@aylee855](https://github.com/aylee855)! - Preserve scheduled reconnect delays when a concurrent state refresh finishes, so snapshot recovery cannot reconnect early or restart the retry wait.

## 0.5.3

### Patch Changes

- [#29](https://github.com/kernel/managed-auth-react/pull/29) [`8eadd7a`](https://github.com/kernel/managed-auth-react/commit/8eadd7a02fcb59822afa1d61050134e7e828e757) Thanks [@masnwilliams](https://github.com/masnwilliams)! - Apply canonical field input modes as virtual keyboard hints without enabling browser format validation.

- [#28](https://github.com/kernel/managed-auth-react/pull/28) [`3261be8`](https://github.com/kernel/managed-auth-react/commit/3261be8f5bf8a8adcace8f19241ab22c77f3f225) Thanks [@masnwilliams](https://github.com/masnwilliams)! - Render canonical identifier fields as text inputs so combined username, email, and phone login fields accept every supported identifier format.

## 0.5.2

### Patch Changes

- [#27](https://github.com/kernel/managed-auth-react/pull/27) [`63cac3e`](https://github.com/kernel/managed-auth-react/commit/63cac3efcba043f8762be5b0f54e3dc1680d2cb3) Thanks [@masnwilliams](https://github.com/masnwilliams)! - Render typed reauthentication blockers and rejected authenticator codes with specific recovery guidance.

## 0.5.1

### Patch Changes

- [#25](https://github.com/kernel/managed-auth-react/pull/25) [`eca48fa`](https://github.com/kernel/managed-auth-react/commit/eca48faea5b59ae4a2e6fd6a4a1cfd378ed4b7ef) Thanks [@masnwilliams](https://github.com/masnwilliams)! - Disable the consent action while the handoff exchange and initial session state load, preventing early interactions from being dropped.

## 0.5.0

### Minor Changes

- [#20](https://github.com/kernel/managed-auth-react/pull/20) [`a390c80`](https://github.com/kernel/managed-auth-react/commit/a390c80a7dc2380c2a08d7b67d44decf386b9e5a) Thanks [@masnwilliams](https://github.com/masnwilliams)! - Prefer canonical managed-auth fields and choices when present, bind submissions to their interaction IDs, refresh stale interactions, and retain legacy rendering and submission fallbacks during the deprecation window.

- [#21](https://github.com/kernel/managed-auth-react/pull/21) [`4ec2a4d`](https://github.com/kernel/managed-auth-react/commit/4ec2a4d119f157234d053b51417060e42f8f5ed7) Thanks [@masnwilliams](https://github.com/masnwilliams)! - Show a notice when a canonical field has `reason: "rejected"`. Adds the `fieldRejectedNotice` label and the `inputRejectedNotice` appearance slot.

## 0.4.1

### Patch Changes

- [#18](https://github.com/kernel/managed-auth-react/pull/18) [`fc3716d`](https://github.com/kernel/managed-auth-react/commit/fc3716d279c6724d7f51d0386f0467bfdb419004) Thanks [@masnwilliams](https://github.com/masnwilliams)! - Stop the site favicon from blocking page load. The icon now renders initials immediately and resolves the favicon out of band (deferred past `window.load`, behind a timeout), so a favicon host that hangs can no longer keep the page from finishing loading.

## 0.4.0

### Minor Changes

- [#9](https://github.com/kernel/managed-auth-react/pull/9) [`045bbae`](https://github.com/kernel/managed-auth-react/commit/045bbaed5d72c36614b88bc4df5455b63866e063) Thanks [@dcruzeneil2](https://github.com/dcruzeneil2)! - Subscribe to managed auth state via the `/auth/connections/{id}/events` SSE endpoint instead of polling `/auth/connections/{id}` every 2s.

## 0.3.0

### Minor Changes

- [#13](https://github.com/kernel/managed-auth-react/pull/13) [`fc77370`](https://github.com/kernel/managed-auth-react/commit/fc773706772e29932ed971c3d3fbeab6833c4bb8) Thanks [@masnwilliams](https://github.com/masnwilliams)! - Auto-resolve SSO provider icons via the Simple Icons CDN. `getSSOProviderInfo` now slugifies any provider key and renders its brand icon from `https://cdn.simpleicons.org/<slug>`, with a circular letter-avatar fallback when the icon fails to load. Removes the hardcoded `GoogleMark` / `GitHubMark` / `GitLabMark` / `MicrosoftMark` / `FacebookMark` / `AppleMark` SVGs in favor of the generic resolver, so new providers render out of the box without library changes. Non-brand keys (`passkey`, `sso`, `saml`) keep their built-in icons.

### Patch Changes

- [#10](https://github.com/kernel/managed-auth-react/pull/10) [`74f27bc`](https://github.com/kernel/managed-auth-react/commit/74f27bcd366fda00c42b1cba3cd2a42ff9d5e217) Thanks [@Tom-Achache](https://github.com/Tom-Achache)! - Guard the bootstrap effect in `useManagedAuthSession` against React 18+ Strict Mode's mount → cleanup → mount double-invocation. Without the guard, the second mount re-fires `exchangeHandoffCode` with a now-consumed handoff code and the component lands in the error state ("Failed to start session") even when auth would have worked. Tracked per `(sessionId, handoffCode)` so a genuine prop change still triggers a fresh exchange.

- [#13](https://github.com/kernel/managed-auth-react/pull/13) [`fc77370`](https://github.com/kernel/managed-auth-react/commit/fc773706772e29932ed971c3d3fbeab6833c4bb8) Thanks [@masnwilliams](https://github.com/masnwilliams)! - Wrap button and option text when content overflows. `.kma-button` previously used `white-space: nowrap` and a fixed `height`, so long MFA / SSO / sign-in option labels clipped past the card on narrower viewports. Switched to `min-height` plus `overflow-wrap: anywhere` so labels wrap and the row grows to fit, and added `padding` + `min-width: 0` on `.kma-sso-button` so its label can shrink.
