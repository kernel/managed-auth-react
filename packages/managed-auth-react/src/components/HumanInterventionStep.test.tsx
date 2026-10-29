import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createElement } from "react";
import { act, create } from "react-test-renderer";
import { AppearanceProvider } from "../appearance/context";
import { LocalizationProvider } from "../localization/context";
import { HumanInterventionStep } from "./HumanInterventionStep";

const LIVE_VIEW = "https://live.example.com/browser/live/abc";
let listener: ((event: MessageEvent) => void) | undefined;

function step(note?: string, liveViewUrl = LIVE_VIEW) {
  return createElement(
    AppearanceProvider,
    null,
    createElement(
      LocalizationProvider,
      null,
      createElement(HumanInterventionStep, {
        targetDomain: "example.com",
        liveViewUrl,
        onDone: () => {},
        note,
      }),
    ),
  );
}

function render(note?: string) {
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(step(note));
  });
  return renderer;
}

const statusText = (renderer: ReturnType<typeof create>) =>
  renderer.root
    .findAll((node) => node.props.role === "status" && node.type === "p")
    .map((node) => node.children.join(""));

describe("HumanInterventionStep", () => {
  // The step listens for live view connection failures on window.
  const hadWindow = "window" in globalThis;
  beforeAll(() => {
    if (!hadWindow) {
      Object.assign(globalThis, {
        window: {
          addEventListener: (_: string, fn: (event: MessageEvent) => void) => {
            listener = fn;
          },
          removeEventListener: () => {
            listener = undefined;
          },
        },
      });
    }
  });
  afterAll(() => {
    if (!hadWindow) delete (globalThis as { window?: unknown }).window;
  });

  test("shows the note when the site asks again", () => {
    const note = "example.com is asking to verify again.";
    expect(statusText(render(note))).toEqual([note]);
  });

  test("shows no note on the first pause", () => {
    expect(statusText(render())).toEqual([]);
  });

  test("starts the live view fresh when its url changes", () => {
    const renderer = render();
    act(() =>
      listener?.({
        origin: "https://live.example.com",
        data: { type: "KERNEL_CONNECTION_FAILED", reason: "unsupported" },
      } as MessageEvent),
    );
    const alerts = () =>
      renderer.root.findAll((node) => node.props.role === "alert");
    expect(alerts()).toHaveLength(1);

    const next = "https://live.example.com/browser/live/def";
    act(() => renderer.update(step(undefined, next)));

    expect(alerts()).toHaveLength(0);
    expect(renderer.root.findByType("iframe" as never).props.src).toBe(next);
    act(() => renderer.unmount());
  });
});
