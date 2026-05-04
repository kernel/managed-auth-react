# `@onkernel/managed-auth-react-netflix-demo`

Netflix-skinned demo of [`@onkernel/managed-auth-react`](../managed-auth-react). Drops `<KernelManagedAuth />` onto a Netflix-style backdrop (red bloom, black gradient, Bebas-Neue wordmark) so you can see the customization API in action against a recognizable brand.

## Run it

From the repo root:

```bash
bun install
bun run --filter @onkernel/managed-auth-react-netflix-demo dev
```

Opens at `http://localhost:5174`.

## Two modes

### Preview mode (default)

The page loads in preview mode — no backend required. A state picker below the auth card lets you scrub through every UI step (`prime`, `discovering`, `awaiting_input`, `success`, `error`, etc.) so you can audit the Netflix theming against every state.

### Live mode

Pass a real session ID and handoff code via URL params and the page renders the all-in-one `<KernelManagedAuth>` component instead:

```
http://localhost:5174/?session=<connectionId>&code=<handoffCode>
```

Generate those on your backend with the Kernel SDK:

```ts
import Kernel from "@onkernel/sdk";

const kernel = new Kernel({ apiKey: process.env.KERNEL_API_KEY });

const connection = await kernel.auth.connections.create({
  domain: "netflix.com",
  profile_name: "demo-user",
});
const { id, handoff_code } = await kernel.auth.connections.login(connection.id);

// Open the demo with these in the URL:
console.log(`http://localhost:5174/?session=${id}&code=${handoff_code}`);
```

## Where the theming lives

`src/netflixAppearance.ts` — exports `netflixAppearance` and `netflixLocalization`. Pure data; no component logic. Lift it into your own app to reproduce the look.
