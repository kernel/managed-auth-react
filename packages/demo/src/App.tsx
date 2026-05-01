import { useMemo, useState } from "react";
import {
  KernelManagedAuth,
  type AuthErrorPayload,
  type AuthSuccessPayload,
  type ManagedAuthResponse,
} from "@onkernel/managed-auth-react";
import "@onkernel/managed-auth-react/styles.css";
import { createMockFetch } from "./mockFetch";

type Mode = "mock" | "live";

export function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const initialMode: Mode = params.get("session") ? "live" : "mock";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [domain, setDomain] = useState(params.get("domain") ?? "github.com");
  const [sessionId, setSessionId] = useState(
    params.get("session") ?? "demo-session-id",
  );
  const [handoffCode, setHandoffCode] = useState(
    params.get("code") ?? "demo-handoff-code",
  );
  const [event, setEvent] = useState<string | null>(null);

  const mockFetch = useMemo(
    () => (mode === "mock" ? createMockFetch({ domain }) : undefined),
    [mode, domain],
  );

  const handleSuccess = (p: AuthSuccessPayload) => {
    setEvent(`onSuccess  →  ${JSON.stringify(p)}`);
  };
  const handleError = (p: AuthErrorPayload) => {
    setEvent(`onError    →  ${JSON.stringify(p)}`);
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h1 style={styles.h1}>@onkernel/managed-auth-react</h1>
        <p style={styles.muted}>
          A live render of <code>&lt;KernelManagedAuth /&gt;</code> exactly as a
          user would see it.
        </p>

        <section style={styles.section}>
          <label style={styles.label}>Mode</label>
          <div style={styles.row}>
            <button
              style={mode === "mock" ? styles.btnActive : styles.btn}
              onClick={() => setMode("mock")}
            >
              Mock backend
            </button>
            <button
              style={mode === "live" ? styles.btnActive : styles.btn}
              onClick={() => setMode("live")}
            >
              Live (api.onkernel.com)
            </button>
          </div>
          <p style={styles.hint}>
            {mode === "mock"
              ? "Uses an in-browser mock fetch so you can click through the entire flow without real Kernel credentials."
              : "Calls the real Kernel API. Provide a valid sessionId + handoffCode below."}
          </p>
        </section>

        {mode === "mock" ? (
          <section style={styles.section}>
            <label style={styles.label}>Target domain</label>
            <input
              style={styles.input}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="github.com"
            />
            <p style={styles.hint}>
              Drives the mocked discovery response (site name, icon, MFA
              fan-out).
            </p>
          </section>
        ) : (
          <section style={styles.section}>
            <label style={styles.label}>Session ID</label>
            <input
              style={styles.input}
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
            />
            <label style={{ ...styles.label, marginTop: 12 }}>
              Handoff code
            </label>
            <input
              style={styles.input}
              value={handoffCode}
              onChange={(e) => setHandoffCode(e.target.value)}
            />
          </section>
        )}

        <section style={styles.section}>
          <label style={styles.label}>Theme</label>
          <div style={styles.row}>
            {(["light", "dark", "auto"] as const).map((t) => (
              <button
                key={t}
                style={theme === t ? styles.btnActive : styles.btn}
                onClick={() => setTheme(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Last event</label>
          <pre style={styles.event}>{event ?? "(none yet)"}</pre>
        </section>
      </aside>

      <main style={styles.stage}>
        <div style={styles.surface} data-theme={theme}>
          <KernelManagedAuth
            key={`${mode}-${domain}-${sessionId}-${handoffCode}`}
            sessionId={sessionId}
            handoffCode={handoffCode}
            appearance={{ theme }}
            onSuccess={handleSuccess}
            onError={handleError}
            fetch={mockFetch as typeof fetch | undefined}
          />
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    minHeight: "100vh",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    background: "#0b0d12",
    color: "#e6e8ee",
  },
  sidebar: {
    padding: 24,
    borderRight: "1px solid #1d2230",
    background: "#0f121a",
    overflowY: "auto",
  },
  stage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    background:
      "radial-gradient(1200px 600px at 50% -10%, rgba(99,102,241,0.18), transparent 60%), #0b0d12",
  },
  surface: {
    width: "100%",
    maxWidth: 460,
  },
  h1: { fontSize: 16, margin: "0 0 8px", fontWeight: 600 },
  muted: {
    fontSize: 13,
    color: "#8a93a6",
    margin: "0 0 20px",
    lineHeight: 1.5,
  },
  section: { marginBottom: 20 },
  label: {
    display: "block",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#8a93a6",
    marginBottom: 8,
  },
  hint: { fontSize: 12, color: "#6b7387", marginTop: 8, lineHeight: 1.5 },
  row: { display: "flex", gap: 6, flexWrap: "wrap" },
  btn: {
    padding: "6px 10px",
    fontSize: 12,
    background: "#161b27",
    color: "#cfd4e1",
    border: "1px solid #232a3a",
    borderRadius: 6,
    cursor: "pointer",
  },
  btnActive: {
    padding: "6px 10px",
    fontSize: 12,
    background: "#3b82f6",
    color: "white",
    border: "1px solid #3b82f6",
    borderRadius: 6,
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    fontSize: 13,
    background: "#161b27",
    color: "#e6e8ee",
    border: "1px solid #232a3a",
    borderRadius: 6,
    boxSizing: "border-box",
  },
  event: {
    margin: 0,
    padding: 10,
    background: "#0a0d14",
    border: "1px solid #1d2230",
    borderRadius: 6,
    fontSize: 12,
    color: "#cfd4e1",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
  },
};

// Re-export the type for explicit typing in styles map.
export type { ManagedAuthResponse };
