import type { ReactNode } from "react";
import {
  AppleMark,
  BuildingIcon,
  FacebookMark,
  GitHubMark,
  GoogleMark,
  KeyIcon,
  MicrosoftMark,
} from "./icons";

export interface SSOProviderInfo {
  label: string;
  icon: ReactNode;
}

export function getSSOProviderInfo(provider: string): SSOProviderInfo {
  const p = provider.toLowerCase();
  if (p.includes("google"))
    return { label: "Google", icon: <GoogleMark className="kma-sso-icon" /> };
  if (p.includes("github"))
    return { label: "GitHub", icon: <GitHubMark className="kma-sso-icon" /> };
  if (p.includes("microsoft") || p.includes("azure"))
    return {
      label: "Microsoft",
      icon: <MicrosoftMark className="kma-sso-icon" />,
    };
  if (p.includes("facebook"))
    return {
      label: "Facebook",
      icon: <FacebookMark className="kma-sso-icon" />,
    };
  if (p.includes("apple"))
    return { label: "Apple", icon: <AppleMark className="kma-sso-icon" /> };
  if (p.includes("saml") || p.includes("sso"))
    return { label: "SSO", icon: <BuildingIcon className="kma-sso-icon" /> };
  if (p.includes("passkey"))
    return { label: "Passkey", icon: <KeyIcon className="kma-sso-icon" /> };
  return { label: provider, icon: null };
}
