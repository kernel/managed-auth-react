import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";
import { useSlot } from "../../appearance/context";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, style, ...rest },
  ref,
) {
  const slot = useSlot();
  const slotProps = slot("input", "kma-input");
  return (
    <input
      ref={ref}
      {...rest}
      className={clsx(slotProps.className, className)}
      style={{ ...slotProps.style, ...style }}
      data-kma-element="input"
    />
  );
});
