import type { CSSProperties } from "react";
import type { ElementStyle, ElementStylePseudoKey } from "./types";

/**
 * Pattern B (Stripe Elements style): allow pseudo-state selectors as nested
 * keys inside an element's `style` object, and compile them to a scoped CSS
 * class at runtime.
 *
 * Why: inline React `style` cannot express `:hover`, `:focus`, `::placeholder`,
 * etc. Without this, customizing hover behavior would require either Tailwind
 * classes (className path) or a global stylesheet — both leak the appearance
 * API outside the `appearance` prop. With this, everything is contained.
 *
 * Mechanism:
 *   1. Split base CSS from pseudo blocks.
 *   2. Hash the pseudo content → stable class name `kma-p-${hash}`.
 *   3. Inject one `<style id="kma-pseudo-styles">` element into the document
 *      head and append rules for each unique hash exactly once.
 *
 * Hover/focus only fire on user interaction (post-hydration), so we skip
 * injection entirely during SSR — the initial HTML never references the
 * generated class until the component is on the client.
 */

const PSEUDO_KEYS: readonly ElementStylePseudoKey[] = [
  ":hover",
  ":focus",
  ":focus-visible",
  ":active",
  ":disabled",
  "::placeholder",
];

const PSEUDO_KEY_SET = new Set<string>(PSEUDO_KEYS);

const isPseudoKey = (k: string): k is ElementStylePseudoKey =>
  PSEUDO_KEY_SET.has(k);

/**
 * React's CSSProperties keys that accept unitless numbers. We only need the
 * ones realistically used in pseudo overrides — full list lives in React
 * itself; expanding it later is harmless. Anything not here gets `px`
 * appended when the value is a raw number.
 */
const UNITLESS_PROPS = new Set<string>([
  "opacity",
  "fontWeight",
  "lineHeight",
  "zIndex",
  "flex",
  "flexGrow",
  "flexShrink",
  "order",
  "columns",
  "columnCount",
]);

const camelToKebab = (s: string): string =>
  s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

function styleObjectToCss(style: CSSProperties): string {
  const decls: string[] = [];
  for (const [key, raw] of Object.entries(style)) {
    if (raw === undefined || raw === null || raw === false) continue;
    const prop = key.startsWith("--") ? key : camelToKebab(key);
    const value =
      typeof raw === "number" && !UNITLESS_PROPS.has(key)
        ? `${raw}px`
        : String(raw);
    decls.push(`${prop}:${value}`);
  }
  return decls.join(";");
}

/** djb2-ish, stable across runs, short base36 output. */
function hash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h) ^ input.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

const injectedHashes = new Set<string>();

function injectRules(className: string, css: string): void {
  if (injectedHashes.has(className)) return;
  injectedHashes.add(className);
  if (typeof document === "undefined") return;

  let el = document.getElementById(
    "kma-pseudo-styles",
  ) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = "kma-pseudo-styles";
    document.head.appendChild(el);
  }
  el.appendChild(document.createTextNode(css));
}

/**
 * Splits an element style object into:
 *   - `base`: a plain CSSProperties to spread on `style={...}`
 *   - `className`: a generated class encoding any pseudo-state rules
 *     (or `undefined` if there were none)
 *
 * The pseudo CSS is injected lazily and deduplicated globally by hash.
 */
export function compilePseudoStyle(style: ElementStyle | undefined): {
  base: CSSProperties | undefined;
  className: string | undefined;
} {
  if (!style) return { base: undefined, className: undefined };

  let pseudoBlocks: Array<[ElementStylePseudoKey, CSSProperties]> | null = null;
  let base: CSSProperties | undefined;

  for (const [key, value] of Object.entries(style)) {
    if (isPseudoKey(key)) {
      if (!value) continue;
      (pseudoBlocks ??= []).push([key, value as CSSProperties]);
    } else {
      (base ??= {})[key as keyof CSSProperties] = value as never;
    }
  }

  if (!pseudoBlocks || pseudoBlocks.length === 0) {
    return { base, className: undefined };
  }

  // Build a stable signature so equivalent pseudo blocks share a class.
  const signature = pseudoBlocks
    .map(([sel, decls]) => `${sel}{${styleObjectToCss(decls)}}`)
    .join("");
  const className = `kma-p-${hash(signature)}`;

  // Note: `:disabled` needs higher specificity than the package's default
  // `.kma-button:disabled { opacity: 0.5 }` rule, but a single class
  // selector at the *element* level is already more specific than the
  // package rules (which use a single class). We rely on source-order
  // (the injected sheet ships AFTER styles.css) to win ties on hover/focus.
  // For belt-and-suspenders, every declaration is emitted with the same
  // class selector and inherits its specificity directly.
  const rules = pseudoBlocks
    .map(([sel, decls]) => `.${className}${sel}{${styleObjectToCss(decls)}}`)
    .join("");

  injectRules(className, rules);

  return { base, className };
}

/** Test-only: clears the in-memory dedupe set. */
export function __resetPseudoCache(): void {
  injectedHashes.clear();
}
