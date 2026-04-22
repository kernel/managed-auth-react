import { forwardRef, type LabelHTMLAttributes } from "react";
import clsx from "clsx";
import { useSlot } from "../../appearance/context";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, style, children, ...rest },
  ref,
) {
  const slot = useSlot();
  const slotProps = slot("label", "kma-label");
  return (
    <label
      ref={ref}
      {...rest}
      className={clsx(slotProps.className, className)}
      style={{ ...slotProps.style, ...style }}
      data-kma-element="label"
    >
      {children}
    </label>
  );
});
