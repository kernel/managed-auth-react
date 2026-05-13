import { useState, type ReactNode } from "react";
import {
  AppleMark,
  BuildingIcon,
  FacebookMark,
  GitHubMark,
  GitLabMark,
  GoogleMark,
  KeyIcon,
  MicrosoftMark,
} from "./icons";

export interface SSOProviderInfo {
  label: string;
  icon: ReactNode;
}

const BUILTIN_PROVIDERS: Record<
  string,
  { label: string; Icon: (p: { className?: string }) => ReactNode }
> = {
  google: { label: "Google", Icon: GoogleMark },
  github: { label: "GitHub", Icon: GitHubMark },
  gitlab: { label: "GitLab", Icon: GitLabMark },
  microsoft: { label: "Microsoft", Icon: MicrosoftMark },
  azure: { label: "Microsoft", Icon: MicrosoftMark },
  facebook: { label: "Facebook", Icon: FacebookMark },
  apple: { label: "Apple", Icon: AppleMark },
  passkey: { label: "Passkey", Icon: KeyIcon },
  sso: { label: "SSO", Icon: BuildingIcon },
  saml: { label: "SSO", Icon: BuildingIcon },
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

function CDNProviderIcon({ provider }: { provider: string }) {
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

  const builtin = BUILTIN_PROVIDERS[key];
  if (builtin) {
    return {
      label: builtin.label,
      icon: <builtin.Icon className="kma-sso-icon" />,
    };
  }

  return {
    label: titleCase(provider),
    icon: <CDNProviderIcon provider={provider} />,
  };
}
