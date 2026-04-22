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

## Styling

Three layers, compose any or all:

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

### 3. Layout toggles

```tsx
<KernelManagedAuth
  appearance={{
    layout: {
      poweredByKernel: false,
      showLegalText: false,
      showSecurityCard: false,
      socialButtonsPlacement: "top",
      skipPrimeStep: true,
    },
  }}
  {...rest}
/>
```

### Theme

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
    mfaTypeLabels: { sms: "SMS", email: "E-mail" },
  }}
  {...rest}
/>
```

See [`Localization`](./src/localization/types.ts) for every supported key.

## API

### `<KernelManagedAuth />` props

| Prop          | Type                                       | Required | Description                                           |
| ------------- | ------------------------------------------ | -------- | ----------------------------------------------------- |
| `sessionId`   | `string`                                   | yes      | Managed auth connection ID from your backend.         |
| `handoffCode` | `string`                                   | yes      | Single-use handoff code, exchanged for a JWT.         |
| `appearance`  | `Appearance`                               | no       | Styling — variables, elements, layout, theme.         |
| `localization`| `Localization`                             | no       | Partial string overrides.                             |
| `onSuccess`   | `(p: AuthSuccessPayload) => void`          | no       | Fires on `SUCCESS`.                                   |
| `onError`     | `(p: AuthErrorPayload) => void`            | no       | Fires on `FAILED`, `CANCELED`, `EXPIRED`.             |
| `baseUrl`     | `string`                                   | no       | Override the Kernel API base URL (for testing).       |
| `fetch`       | `typeof fetch`                             | no       | Inject a custom fetch (for SSR or instrumentation).   |

## Element keys

`root`, `shell`, `card`, `poweredBy`, `poweredByLink`, `siteIcon`, `title`, `subtitle`, `description`, `securityCard`, `securityRow`, `securityIcon`, `securityText`, `label`, `inputWrapper`, `input`, `inputHint`, `passwordToggle`, `button`, `buttonPrimary`, `buttonSecondary`, `divider`, `dividerLine`, `dividerText`, `ssoButton`, `ssoButtonIcon`, `ssoButtonLabel`, `mfaOption`, `mfaOptionIcon`, `mfaOptionLabel`, `mfaOptionTarget`, `mfaOptionDescription`, `signInOption`, `signInOptionLabel`, `signInOptionDescription`, `signInOptionChevron`, `errorBanner`, `errorBannerText`, `errorIcon`, `errorTitle`, `errorDescription`, `errorCode`, `successIcon`, `successTitle`, `successDescription`, `expiredCard`, `expiredTitle`, `expiredDescription`, `spinner`, `loadingText`, `externalActionIcon`, `externalActionMessage`, `form`, `formField`, `legalText`, `legalLink`.

## License

MIT
