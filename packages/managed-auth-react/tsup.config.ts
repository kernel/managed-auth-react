import { defineConfig } from "tsup";
import { cp, rm } from "node:fs/promises";
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
    await rm(targetDist, { recursive: true, force: true });
    await cp("dist", targetDist, { recursive: true });
    console.log(`[dev:link] Synced dist → ${targetDist}`);
  },
});
