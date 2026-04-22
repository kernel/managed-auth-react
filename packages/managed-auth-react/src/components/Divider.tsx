import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";

export function Divider() {
  const slot = useSlot();
  const l = useLocalization();
  const root = slot("divider", "kma-divider");
  const line = slot("dividerLine", "kma-divider__line");
  const text = slot("dividerText", "kma-divider__text");
  return (
    <div {...root}>
      <span {...line} />
      <span {...text}>{l.orDivider}</span>
    </div>
  );
}
