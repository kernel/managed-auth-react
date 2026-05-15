---
"@onkernel/managed-auth-react": minor
---

Auto-resolve SSO provider icons via the Simple Icons CDN. `getSSOProviderInfo` now slugifies any provider key and renders its brand icon from `https://cdn.simpleicons.org/<slug>`, with a circular letter-avatar fallback when the icon fails to load. Removes the hardcoded `GoogleMark` / `GitHubMark` / `GitLabMark` / `MicrosoftMark` / `FacebookMark` / `AppleMark` SVGs in favor of the generic resolver, so new providers render out of the box without library changes. Non-brand keys (`passkey`, `sso`, `saml`) keep their built-in icons.
