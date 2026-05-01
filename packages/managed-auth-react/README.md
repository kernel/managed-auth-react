# @onkernel/managed-auth-react

One drop-in React component for [Kernel](https://onkernel.com) managed auth. Plug in your session, customize every element, ship.

```bash
bun add @onkernel/managed-auth-react
# or: npm install @onkernel/managed-auth-react
```

## Quick start

```tsx
import { KernelManagedAuth } from "@onkernel/managed-auth-react";
import "@onkernel/managed-auth-react/styles.css";

export default function LoginPage() {
  return (
    <KernelManagedAuth
      sessionId={sessionId}
      handoffCode={handoffCode}
      onSuccess={({ profileName, domain }) => {
        window.location.href = `/connected?profile=${profileName}`;
      }}
      onError={({ code, message }) => {
        console.error(code, message);
      }}
    />
  );
}
```

`sessionId` and `handoffCode` come from your backend's call to `POST /profiles/auth/{id}/login` — pass the connection ID and the single-use `code` query parameter from the returned `hosted_url`.

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

| Prop           | Type                              | Required | Description                                         |
| -------------- | --------------------------------- | -------- | --------------------------------------------------- |
| `sessionId`    | `string`                          | yes      | Managed auth connection ID from your backend.       |
| `handoffCode`  | `string`                          | yes      | Single-use handoff code, exchanged for a JWT.       |
| `appearance`   | `Appearance`                      | no       | Styling — variables, elements, layout, theme.       |
| `localization` | `Localization`                    | no       | Partial string overrides.                           |
| `onSuccess`    | `(p: AuthSuccessPayload) => void` | no       | Fires on `SUCCESS`.                                 |
| `onError`      | `(p: AuthErrorPayload) => void`   | no       | Fires on `FAILED`, `CANCELED`, `EXPIRED`.           |
| `baseUrl`      | `string`                          | no       | Override the Kernel API base URL (for testing).     |
| `fetch`        | `typeof fetch`                    | no       | Inject a custom fetch (for SSR or instrumentation). |

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
