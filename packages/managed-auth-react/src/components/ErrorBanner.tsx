import { useSlot } from "../appearance/context";

export function ErrorBanner({ message }: { message: string }) {
  const slot = useSlot();
  return (
    <div {...slot("errorBanner", "kma-error-banner")}>
      <p {...slot("errorBannerText", "kma-error-banner__text")}>{message}</p>
    </div>
  );
}
