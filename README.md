# managed-auth-react

Monorepo for [`@onkernel/managed-auth-react`](./packages/managed-auth-react) — a drop-in React component for Kernel managed auth.

## Packages

- [`@onkernel/managed-auth-react`](./packages/managed-auth-react) — the published component library.
- [`@onkernel/managed-auth-react-demo`](./packages/demo) — local-only Vite app with two tabs: every UI state in the package, and eight worked appearance variants. Runs without a Kernel account.

## Development

```bash
bun install
bun run --filter '@onkernel/managed-auth-react' build
bun run --filter '@onkernel/managed-auth-react' typecheck
bun run --filter '@onkernel/managed-auth-react-demo' dev
# → http://localhost:5173 (auto-opens; #states or #appearances tabs)
```

For live iteration on the package itself, run the package in watch mode in another terminal — Vite picks up the rebuilt `dist/` automatically:

```bash
bun run --filter '@onkernel/managed-auth-react' dev
```

### Linking into a consumer (e.g. managed-auth-hosted-ui)

`tsup` watch mode can mirror `dist/` into a consumer's `node_modules` after every successful rebuild. Cleanest way to iterate on the package against real consumers without dealing with bun symlinks or stale tarballs:

```bash
# In the consumer (one-time): install the package once via tarball/file dep so
# node_modules/@onkernel/managed-auth-react/ exists.

# In packages/managed-auth-react (LINK_TO is resolved relative to the
# package dir, so 3 levels up lands in the parent of this repo):
LINK_TO=../../../managed-auth-hosted-ui/node_modules/@onkernel/managed-auth-react bun run dev
# Shorthand assuming managed-auth-hosted-ui is a sibling of this repo:
bun run dev:hosted-ui
```

Every successful build (JS + DTS) replaces the consumer's `dist/`, so refreshing the dev server picks up changes immediately — no reinstall needed.

## CI / releases

- `.github/workflows/test.yaml` runs on every PR and push to `main`: `format:check`, `typecheck`, `build`, and a `npm pack --dry-run` to verify publishability.
- `.github/workflows/release.yaml` triggers on `v*` tags. Verifies the tag matches `package.json`, builds, and publishes to npm via OIDC trusted publishing (`--provenance`). Hyphenated tags like `v0.2.0-beta.1` are marked as GitHub prereleases.

To cut a release:

```bash
# Bump the version in packages/managed-auth-react/package.json on main, then:
git tag v0.2.0
git push origin v0.2.0
```

Bun is pinned to `1.2.21` in both workflows (and in `packageManager` at the root) so lockfile-format drift across bun majors doesn't silently break CI.

## License

MIT
