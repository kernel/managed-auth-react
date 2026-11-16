---
"@onkernel/managed-auth-react": minor
---

Ship built-in localizations for Danish, German, Spanish, Finnish, French, Italian, Norwegian Bokmål, Dutch, Polish, and Swedish, exported as `LOCALIZATIONS` with a `matchLocale` helper that picks one from the user's preferred languages. Error-code titles and descriptions and the "Powered by" footer are now part of `Localization` (`errorCodeMessages`, `poweredBy`), so they can be translated like the rest of the flow. `Localizer` now requires complete `mfaTypeLabels` and `errorCodeMessages` maps.
