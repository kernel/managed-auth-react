const MULTI_PART_TLDS = new Set([
  "co.uk",
  "co.jp",
  "co.kr",
  "co.nz",
  "co.za",
  "co.in",
  "co.id",
  "co.th",
  "com.au",
  "com.br",
  "com.cn",
  "com.mx",
  "com.tw",
  "com.sg",
  "com.ar",
  "com.co",
  "com.tr",
  "org.uk",
  "org.au",
  "net.au",
  "ac.uk",
  "gov.uk",
  "ne.jp",
  "or.jp",
]);

export function extractDomainName(targetDomain: string): string {
  return targetDomain
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .split("/")[0]
    .replace(/:\d+$/, "");
}

export function extractPrimaryDomainLabel(hostname: string): string {
  const parts = hostname.split(".");
  if (parts.length <= 1) return parts[0] || hostname;
  if (parts.length === 2) return parts[0];
  const lastTwo = parts.slice(-2).join(".");
  const tldLength = MULTI_PART_TLDS.has(lastTwo.toLowerCase()) ? 2 : 1;
  const primaryIndex = parts.length - tldLength - 1;
  if (primaryIndex >= 0) return parts[primaryIndex];
  return parts[0];
}
