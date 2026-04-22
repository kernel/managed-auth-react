import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { useSlot } from "../../appearance/context";

type Variant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** Optional slot key for per-usage overrides (e.g. "ssoButton", "mfaOption"). */
  slotKey?:
    | "button"
    | "buttonPrimary"
    | "buttonSecondary"
    | "ssoButton"
    | "mfaOption"
    | "signInOption";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", slotKey, className, type = "button", children, ...rest },
  ref,
) {
  const slot = useSlot();
  const baseProps = slot(
    "button",
    clsx("kma-button", variant === "primary" ? "kma-button--primary" : "kma-button--secondary"),
  );
  const variantProps = slot(
    variant === "primary" ? "buttonPrimary" : "buttonSecondary",
    undefined,
  );
  const extraProps = slotKey && slotKey !== "button" ? slot(slotKey, undefined) : null;

  const merged = {
    className: clsx(
      baseProps.className,
      variantProps.className,
      extraProps?.className,
      className,
    ),
    style: { ...baseProps.style, ...variantProps.style, ...extraProps?.style },
  };

  return (
    <button
      ref={ref}
      type={type}
      data-kma-element={extraProps ? slotKey : variant === "primary" ? "buttonPrimary" : "buttonSecondary"}
      {...rest}
      className={merged.className}
      style={{ ...merged.style, ...rest.style }}
    >
      {children}
    </button>
  );
});
