---
"@onkernel/managed-auth-react": patch
---

Stop the site favicon from blocking page load. The icon now renders initials immediately and resolves the favicon out of band (deferred past `window.load`, behind a timeout), so a favicon host that hangs can no longer keep the page from finishing loading.
