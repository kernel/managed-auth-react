---
"@onkernel/managed-auth-react": patch
---

Preserve scheduled reconnect delays when a concurrent state refresh finishes, so snapshot recovery cannot reconnect early or restart the retry wait.
