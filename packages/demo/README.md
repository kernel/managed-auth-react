# @onkernel/managed-auth-react-demo

Local-only Vite app for previewing [`@onkernel/managed-auth-react`](../managed-auth-react). Two tabs:

- **States** — every UI state in the package (prime, discovering, awaiting input + SSO + MFA + sign-in options, external action, success, expired, error) rendered against the default theme. Use the top-right state picker to scrub.
- **Appearances** — eight worked customization variants (default + 7 brand-inspired: Linear, Vercel, Stripe, Notion, Anthropic, Supabase, Kernel brand). Each variant renders the same step in lockstep so you can audit how every brand handles every screen.

The auth flow is rendered headless (no real Kernel API calls); we mount the package's step components directly so you can iterate on styling without needing a live session.

## Run

```bash
# from the repo root
bun install
bun run --filter '@onkernel/managed-auth-react' build
bun run --filter '@onkernel/managed-auth-react-demo' dev
# → http://localhost:5173 (auto-opens)
```

For live iteration on the package itself, run the package in watch mode in another terminal:

```bash
bun run --filter '@onkernel/managed-auth-react' dev
# tsup --watch; the demo Vite server picks up changes automatically.
```

## Why this exists

Documentation that you can click through. Anyone evaluating the package should be able to clone and see every state and customization variant in under a minute, without standing up a Kernel account.

This is intentionally not deployed anywhere — keep it lean, no hosting story to maintain.
