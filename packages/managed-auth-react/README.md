# @onkernel/managed-auth-react

One drop-in React component for [Kernel](https://onkernel.com) managed auth. Plug in your session, customize every element, ship.

```bash
bun add @onkernel/managed-auth-react
# or: npm install @onkernel/managed-auth-react
```

## Quick start

### 1. On the backend, create a connection and start a login

```ts
import Kernel from "@onkernel/sdk";

const kernel = new Kernel({ apiKey: process.env.KERNEL_API_KEY });

// Per profile + domain combination. Returns 409 if one already exists.
const connection = await kernel.auth.connections.create({
  domain: "netflix.com",
  profile_name: "user-123",
});

// Starts a login flow and returns the URL the end user should be sent to.
// `hosted_url` is shaped like `https://<your-domain>/<your-route>/{id}?code=<handoff>`
// based on how your Kernel project is configured.
const { hosted_url } = await kernel.auth.connections.login(connection.id);
```

Redirect (or pop open) the user to `hosted_url`.

### 2. On the frontend, render the component on the route the URL points at

The route just needs to surface the connection `id` (path param) and the `code` (query param) and hand them to the component. In Next.js App Router that looks like:

```tsx
// app/login/[id]/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { use } from "react";
import { KernelManagedAuth } from "@onkernel/managed-auth-react";
import "@onkernel/managed-auth-react/styles.css";

export default function LoginPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const code = useSearchParams().get("code") ?? "";

  return (
    <KernelManagedAuth
      sessionId={id}
      handoffCode={code}
      onSuccess={({ profileName, domain }) => {
        window.location.href = `/connected?profile=${profileName}`;
      }}
      onError={({ code: errCode, message }) => {
        console.error(errCode, message);
      }}
    />
  );
}
```

The component is client-only — `"use client"` is required in any RSC framework (Next.js App Router, Remix, etc.).

## Backend / API connectivity

By default the component talks directly to `https://api.onkernel.com`. That works out of the box; nothing else to configure.

If you'd rather keep all auth traffic same-origin (cookies, CSP, observability), set `baseUrl=""` and proxy the three endpoints the package hits through your own framework:

```ts
// next.config.ts
export default {
  async rewrites() {
    return [
      {
        source: "/auth/connections/:id/exchange",
        destination: `${process.env.KERNEL_BASE_URL}/auth/connections/:id/exchange`,
      },
      {
        source: "/auth/connections/:id",
        destination: `${process.env.KERNEL_BASE_URL}/auth/connections/:id`,
      },
      {
        source: "/auth/connections/:id/submit",
        destination: `${process.env.KERNEL_BASE_URL}/auth/connections/:id/submit`,
      },
    ];
  },
};
```

```tsx
<KernelManagedAuth sessionId={id} handoffCode={code} baseUrl="" {...rest} />
```

The full reference integration (rewrites + client) lives at [`kernel/managed-auth-hosted-ui`](https://github.com/kernel/managed-auth-hosted-ui).

## Styling

Four layers, compose any or all.

### 1. Design tokens → CSS variables

```tsx
<KernelManagedAuth
  appearance={{
    variables: {
      colorPrimary: "#0f172a",
      borderRadius: 12,
      fontFamily: "'Inter', sans-serif",
    },
  }}
  {...rest}
/>
```

Every `AppearanceVariables` field becomes a `--kma-*` CSS custom property on the root, so you can also wire them up from your own stylesheet.

### 2. Per-element overrides

Every element has a stable key. Hit it with a class, a style object, or both:

```tsx
<KernelManagedAuth
  appearance={{
    elements: {
      card: "my-card-class",
      buttonPrimary: {
        className: "my-button",
        style: { letterSpacing: "0.02em" },
      },
      title: { style: { fontSize: 28 } },
    },
  }}
  {...rest}
/>
```

Every rendered element also carries a `data-kma-element="<key>"` attribute, so you can target them from global CSS too:

```css
[data-kma-element="buttonPrimary"] {
  text-transform: uppercase;
}
```

#### Pseudo-state styles

Style objects support nested pseudo-state selectors (Stripe Elements pattern). They're compiled to scoped CSS at runtime — no separate stylesheet, no `<style>` tag in your tree:

```tsx
<KernelManagedAuth
  appearance={{
    elements: {
      input: {
        style: {
          borderColor: "#cbd5e1",
          ":hover": { borderColor: "#94a3b8" },
          ":focus-visible": {
            borderColor: "#0f172a",
            boxShadow: "0 0 0 3px rgba(15, 23, 42, 0.15)",
          },
          "::placeholder": { color: "#94a3b8" },
        },
      },
      buttonSecondary: {
        style: {
          ":hover": { textDecoration: "underline", opacity: 1 },
        },
      },
    },
  }}
  {...rest}
/>
```

Supported keys: `:hover`, `:focus`, `:focus-visible`, `:active`, `:disabled`, `::placeholder`.

### 3. Layout toggles

```tsx
<KernelManagedAuth
  appearance={{
    layout: {
      poweredByKernel: false,
      kernelLogoColor: "white", // 'auto' | 'green' | 'black' | 'white'
      showLegalText: false,
      showSecurityCard: false,
      socialButtonsPlacement: "top",
      skipPrimeStep: true,
    },
  }}
  {...rest}
/>
```

`kernelLogoColor` is restricted to the four brand-sanctioned options. For anything else (one-off marketing tints, etc.) reach for the `elements.poweredByLogo` slot — it accepts arbitrary CSS.

### 4. Theme

```tsx
<KernelManagedAuth appearance={{ theme: "dark" }} {...rest} />
// "light" | "dark" | "auto" (default: auto, respects prefers-color-scheme)
```

## Localization

Pass a partial map; everything else falls back to English.

```tsx
<KernelManagedAuth
  localization={{
    primeTitle: (site) => `Connectez-vous à ${site}`,
    primeContinueButton: "Continuer",
    submitButton: "Se connecter",
    mfaTypeLabels: { sms: "SMS", email: "E-mail", switch: "Autre méthode" },
  }}
  {...rest}
/>
```

See [`Localization`](./src/localization/types.ts) for every supported key.

## API

### `<KernelManagedAuth />` props

| Prop           | Type                              | Required | Default                      | Description                                                                              |
| -------------- | --------------------------------- | -------- | ---------------------------- | ---------------------------------------------------------------------------------------- |
| `sessionId`    | `string`                          | yes      | —                            | Managed auth connection ID from your backend.                                            |
| `handoffCode`  | `string`                          | yes      | —                            | Single-use handoff code, exchanged for a JWT.                                            |
| `appearance`   | `Appearance`                      | no       | —                            | Styling — variables, elements, layout, theme.                                            |
| `localization` | `Localization`                    | no       | English                      | Partial string overrides.                                                                |
| `onSuccess`    | `(p: AuthSuccessPayload) => void` | no       | —                            | Fires on `SUCCESS`. Payload: `{ profileName: string; domain: string }`.                  |
| `onError`      | `(p: AuthErrorPayload) => void`   | no       | —                            | Fires on `FAILED`, `CANCELED`, `EXPIRED`. Payload: `{ code?: string; message: string }`. |
| `baseUrl`      | `string`                          | no       | `"https://api.onkernel.com"` | Override the Kernel API origin. Use `""` for same-origin proxying via your own rewrites. |
| `fetch`        | `typeof fetch`                    | no       | `globalThis.fetch`           | Inject a custom fetch (for SSR or instrumentation).                                      |

### Headless step components

For 99% of integrations you want `<KernelManagedAuth />`. If you need to drive the UI yourself — custom controllers, test harnesses, Storybook, or a non-standard flow — the underlying step components are all exported:

```tsx
import {
  Shell,
  StepPrime,
  StepSuccess,
  StepError,
  StepExpired,
  LoadingState,
  ExternalActionWaiting,
  UnifiedAuthForm,
  AppearanceProvider,
  LocalizationProvider,
} from "@onkernel/managed-auth-react";
```

Wrap them in `<AppearanceProvider>` and `<LocalizationProvider>` to inherit the same styling/localization plumbing as the all-in-one component. See `app/test-new/` in the [hosted-ui repo](https://github.com/kernel/managed-auth-hosted-ui) for a working harness.

### Element keys

`root`, `shell`, `card`, `poweredBy`, `poweredByLink`, `poweredByLogo`, `siteIcon`, `title`, `subtitle`, `description`, `securityCard`, `securityRow`, `securityIcon`, `securityText`, `label`, `inputWrapper`, `input`, `inputHint`, `passwordToggle`, `button`, `buttonPrimary`, `buttonSecondary`, `divider`, `dividerLine`, `dividerText`, `ssoButton`, `ssoButtonIcon`, `ssoButtonLabel`, `mfaOption`, `mfaOptionIcon`, `mfaOptionLabel`, `mfaOptionTarget`, `mfaOptionDescription`, `signInOption`, `signInOptionLabel`, `signInOptionDescription`, `signInOptionChevron`, `errorBanner`, `errorBannerText`, `errorIcon`, `errorTitle`, `errorDescription`, `errorCode`, `successIcon`, `successTitle`, `successDescription`, `expiredIcon`, `expiredCard`, `expiredTitle`, `expiredDescription`, `spinner`, `loadingText`, `externalActionIcon`, `externalActionMessage`, `form`, `formField`, `legalText`, `legalLink`.

`ssoButton`, `mfaOption`, and `signInOption` compose `button` → `buttonSecondary` → the slot-specific key, so any styling applied at `buttonSecondary` (e.g. a shared hover state) flows through to all three.

## License

MIT
