import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { useSlot } from "../appearance/context";
import { variablesToStyle } from "../appearance/variables";
import type { Appearance, ColorScheme } from "../appearance/types";
import { KernelLogo } from "./KernelLogo";

interface ShellProps {
  appearance?: Appearance;
  children: ReactNode;
}

function themeClass(theme: ColorScheme | undefined): string {
  if (theme === "dark") return "kma-theme-dark";
  if (theme === "light") return "kma-theme-light";
  return "kma-theme-auto";
}

export function Shell({ appearance, children }: ShellProps) {
  const slot = useSlot();
  const root = slot("root", clsx("kma-root", themeClass(appearance?.theme)));
  const shell = slot("shell", "kma-shell");
  const card = slot("card", "kma-card");
  const poweredBy = slot("poweredBy", "kma-powered-by");
  const poweredByLink = slot("poweredByLink", "kma-powered-by__link");

  const mergedStyle: CSSProperties = {
    ...variablesToStyle(appearance?.variables),
    ...root.style,
  };

  const showPoweredBy = appearance?.layout?.poweredByKernel !== false;

  return (
    <div {...root} style={mergedStyle}>
      <div {...shell}>
        <div {...card}>{children}</div>
        {showPoweredBy && (
          <div {...poweredBy}>
            <span className="kma-powered-by__prefix">Powered by</span>
            <a
              {...poweredByLink}
              href="https://kernel.sh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kernel"
            >
              <KernelLogo />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
