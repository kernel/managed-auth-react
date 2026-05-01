import { useEffect, useState } from "react";
import { Appearances } from "./Appearances";
import { States } from "./States";

type Tab = "states" | "appearances";

const TABS: { id: Tab; label: string; description: string }[] = [
  {
    id: "states",
    label: "States",
    description:
      "Every UI state in the package, rendered against the default theme. Pick a state to inspect copy, spacing, and behaviour.",
  },
  {
    id: "appearances",
    label: "Appearances",
    description:
      "Eight worked customization variants (default + 7 brand-inspired). Use the step picker to scrub every state across every variant simultaneously.",
  },
];

function getInitialTab(): Tab {
  if (typeof window === "undefined") return "states";
  const hash = window.location.hash.slice(1) as Tab;
  return TABS.some((t) => t.id === hash) ? hash : "states";
}

export function App() {
  const [tab, setTab] = useState<Tab>(getInitialTab);

  // Keep the hash in sync so reloads land on the same tab and tabs are linkable.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash.slice(1) !== tab) {
      window.history.replaceState(null, "", `#${tab}`);
    }
  }, [tab]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <nav style={navStyles.bar}>
        <div style={navStyles.brand}>
          <strong>@onkernel/managed-auth-react</strong>
          <span style={navStyles.brandSub}>local demo</span>
        </div>
        <div style={navStyles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={tab === t.id ? navStyles.tabActive : navStyles.tab}
              title={t.description}
            >
              {t.label}
            </button>
          ))}
        </div>
        <a
          href="https://github.com/kernel/managed-auth-react"
          target="_blank"
          rel="noreferrer"
          style={navStyles.repo}
        >
          GitHub →
        </a>
      </nav>
      <main>{tab === "states" ? <States /> : <Appearances />}</main>
    </div>
  );
}

const navStyles: Record<string, React.CSSProperties> = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    padding: "12px 24px",
    borderBottom: "1px solid var(--border)",
    background: "var(--card)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
    fontSize: 13,
    color: "var(--foreground)",
  },
  brandSub: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--muted-foreground)",
  },
  tabs: {
    display: "flex",
    gap: 4,
    flex: 1,
    justifyContent: "center",
  },
  tab: {
    padding: "6px 12px",
    fontSize: 13,
    background: "transparent",
    color: "var(--muted-foreground)",
    border: "1px solid transparent",
    borderRadius: 6,
    cursor: "pointer",
  },
  tabActive: {
    padding: "6px 12px",
    fontSize: 13,
    background: "var(--muted)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 500,
  },
  repo: {
    fontSize: 12,
    color: "var(--muted-foreground)",
    textDecoration: "none",
  },
};
