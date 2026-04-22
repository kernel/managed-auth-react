import { useSlot } from "../appearance/context";
import { extractPrimaryDomainLabel } from "../lib/profile-name";

interface SiteIconProps {
  siteName: string;
  tone?: "normal" | "muted";
}

export function SiteIcon({ siteName, tone = "normal" }: SiteIconProps) {
  const slot = useSlot();
  const slotProps = slot(
    "siteIcon",
    tone === "muted" ? "kma-site-icon kma-site-icon--muted" : "kma-site-icon",
  );
  const initials = extractPrimaryDomainLabel(siteName).slice(0, 2).toUpperCase();

  return (
    <div {...slotProps}>
      <img
        src={`https://geticon.io/img?url=https://${siteName}&size=128`}
        alt={siteName}
        className="kma-site-icon__img"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent && !parent.dataset.kmaFallbackRendered) {
            parent.dataset.kmaFallbackRendered = "1";
            const span = document.createElement("span");
            span.className = "kma-site-icon__fallback";
            span.textContent = initials;
            parent.appendChild(span);
          }
        }}
      />
    </div>
  );
}
