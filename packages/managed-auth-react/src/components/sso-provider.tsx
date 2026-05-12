import { useState, type ReactNode } from "react";
import { BuildingIcon, KeyIcon } from "./icons";

export interface SSOProviderInfo {
  label: string;
  icon: ReactNode;
}

const NON_BRAND_ICONS: Record<string, { label: string; icon: ReactNode }> = {
  passkey: { label: "Passkey", icon: <KeyIcon className="kma-sso-icon" /> },
  sso: { label: "SSO", icon: <BuildingIcon className="kma-sso-icon" /> },
  saml: { label: "SSO", icon: <BuildingIcon className="kma-sso-icon" /> },
};

function slugify(provider: string): string {
  return provider.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function titleCase(provider: string): string {
  return provider
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function SSOProviderIcon({ provider }: { provider: string }) {
  const [errored, setErrored] = useState(false);
  const slug = slugify(provider);
  const letter = provider.trim().charAt(0).toUpperCase() || "?";

  if (!slug || errored) {
    return (
      <span className="kma-sso-icon kma-sso-icon--letter" aria-hidden="true">
        {letter}
      </span>
    );
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}`}
      alt=""
      className="kma-sso-icon"
      onError={() => setErrored(true)}
    />
  );
}

export function getSSOProviderInfo(provider: string): SSOProviderInfo {
  const key = slugify(provider);
  const nonBrand = NON_BRAND_ICONS[key];
  if (nonBrand) return nonBrand;
  return {
    label: titleCase(provider),
    icon: <SSOProviderIcon provider={provider} />,
  };
}
