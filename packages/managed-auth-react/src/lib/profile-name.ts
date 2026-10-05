import { parse } from "tldts";

export function extractDomainName(targetDomain: string): string {
  return targetDomain
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .split("/")[0]
    .replace(/:\d+$/, "");
}

export function extractPrimaryDomainLabel(hostname: string): string {
  const domain = parse(hostname).domain;
  return domain ? domain.split(".")[0] : hostname.split(".")[0] || hostname;
}
