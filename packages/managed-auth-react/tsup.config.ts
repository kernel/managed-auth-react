import { defineConfig } from "tsup";
import { cp, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// Set LINK_TO=<absolute_or_relative_path_to_consumer>/node_modules/@onkernel/managed-auth-react
// to mirror dist/ into a consumer's node_modules after every successful build.
// Used by the `dev:link` and `link:once` scripts so iteration on the package
// shows up in the hosted-ui without paying the bun-tarball-cache tax.
const LINK_TO = process.env.LINK_TO;

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"],
  target: "es2020",
  async onSuccess() {
    await cp("src/styles/styles.css", "dist/styles.css");

    if (!LINK_TO) return;
    const target = resolve(LINK_TO);
    const targetDist = `${target}/dist`;
    if (!existsSync(target)) {
      console.warn(
        `[dev:link] LINK_TO=${LINK_TO} resolves to ${target}, which doesn't ` +
          `exist. Run \`bun install\` in the consumer first so the package's ` +
          `node_modules entry is created.`,
      );
      return;
    }

    // tsup's `onSuccess` fires after the JS build but BEFORE the DTS
    // sub-process completes. Mirroring dist/ now would copy a stale
    // index.d.ts and consumers' typecheck would fail with phantom
    // "property doesn't exist" errors.
    //
    // Anchor on the JS bundle's mtime (just written this build) and wait
    // until index.d.ts is at least as fresh. Works for both clean builds
    // (where the d.ts doesn't exist yet) and --watch builds (where it
    // exists but is stale until DTS finishes).
    await waitForDtsRefresh("dist/index.js", "dist/index.d.ts", 5000);

    await rm(targetDist, { recursive: true, force: true });
    await cp("dist", targetDist, { recursive: true });
    console.log(`[dev:link] Synced dist → ${targetDist}`);
  },
});

async function waitForDtsRefresh(
  jsPath: string,
  dtsPath: string,
  timeoutMs: number,
): Promise<void> {
  const jsMtime = (await stat(jsPath)).mtimeMs;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (existsSync(dtsPath)) {
      const dtsMtime = (await stat(dtsPath)).mtimeMs;
      if (dtsMtime >= jsMtime) return;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  console.warn(`[dev:link] Timed out waiting for ${dtsPath}; syncing anyway.`);
}
