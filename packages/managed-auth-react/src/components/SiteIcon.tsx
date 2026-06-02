import { useEffect, useState } from "react";
import { useSlot } from "../appearance/context";
import { extractPrimaryDomainLabel } from "../lib/profile-name";

interface SiteIconProps {
  siteName: string;
  tone?: "normal" | "muted";
}

// The favicon is decorative and must never hold up the page. The hosted login
// UI renders inside an automated browser that waits for `window.load`, and a
// pending <img> delays that event — so a third-party favicon host that hangs
// (as it does for authed sites whose icon it can't fetch) would keep the page
// from ever finishing loading. We resolve the icon out of band instead: render
// initials immediately, start the request only after load and behind a timeout,
// and mount an <img> only once it has actually decoded.
export function SiteIcon({ siteName, tone = "normal" }: SiteIconProps) {
  const slot = useSlot();
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const slotProps = slot(
    "siteIcon",
    tone === "muted" ? "kma-site-icon kma-site-icon--muted" : "kma-site-icon",
  );
  const initials = extractPrimaryDomainLabel(siteName)
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    setIconUrl(null);
    if (!siteName) return;

    const url = `https://geticon.io/img?url=https://${siteName}&size=128`;
    let img: HTMLImageElement | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const cancel = () => {
      if (timer) clearTimeout(timer);
      if (img) {
        img.onload = img.onerror = null;
        img.src = "";
        img = null;
      }
    };
    const start = () => {
      img = new Image();
      img.onload = () => setIconUrl(url);
      img.onerror = cancel;
      img.src = url;
      timer = setTimeout(cancel, 3000);
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      window.removeEventListener("load", start);
      cancel();
    };
  }, [siteName]);

  return (
    <div {...slotProps}>
      {iconUrl ? (
        <img src={iconUrl} alt={siteName} className="kma-site-icon__img" />
      ) : (
        <span className="kma-site-icon__fallback">{initials}</span>
      )}
    </div>
  );
}
