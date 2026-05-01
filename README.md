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
- `.github/workflows/release.yaml` runs on every push to `main` and is driven by [Changesets](https://github.com/changesets/changesets). Either opens/updates a "Version Packages" PR, or — when that PR is merged — publishes to npm via OIDC trusted publishing.

Bun is pinned to `1.2.21` in both workflows (and in `packageManager` at the root) so lockfile-format drift across bun majors doesn't silently break CI.

### Cutting a release

The release flow is fully PR-driven — no direct `package.json` edits, no manual `git tag`, no main-branch bypasses.

1. **In any PR that changes published behavior**, add a changeset:

   ```bash
   bun run changeset
   ```

   The CLI asks which packages changed and which bump (patch / minor / major), then writes a `.changeset/<random>.md` file describing the change. Commit it alongside your code.

   Skip the changeset for tooling/infra/docs PRs that don't affect what consumers see.

2. **Merge your PR to `main`.** The Changesets bot runs and either:
   - Opens (or updates) a single **"chore: version packages"** PR that bumps `package.json` versions, regenerates `CHANGELOG.md`, and deletes the consumed changeset files. Multiple feature PRs accumulate into the same Version PR.
   - If no pending changesets exist (i.e. the Version PR was just merged), runs `bun run release` which builds the package and calls `changeset publish` → `npm publish` for every version not yet on the registry, then tags + creates the GitHub release.

3. **To ship**, review and merge the open Version PR. The next workflow run publishes.

That's it. The git tag, npm publish, and GitHub release are all created by the bot on Version-PR merge.

## License

MIT
