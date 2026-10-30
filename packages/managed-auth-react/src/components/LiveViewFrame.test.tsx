import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { AppearanceProvider } from "../appearance/context";
import { LocalizationProvider } from "../localization/context";
import { DEFAULT_LOCALIZATION } from "../localization";
import { LiveViewFrame } from "./LiveViewFrame";

const URL_ = "https://live.example.com/browser/live/abc";
const ORIGIN = "https://live.example.com";
let listener: ((event: MessageEvent) => void) | undefined;

// The frame listens for live view messages on window.
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

function render(startTimeoutMs = 60_000) {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      createElement(
        AppearanceProvider,
        null,
        createElement(
          LocalizationProvider,
          null,
          createElement(LiveViewFrame, { url: URL_, startTimeoutMs }),
        ),
      ),
    );
  });
  return renderer;
}

function post(data: unknown, origin = ORIGIN) {
  act(() => listener?.({ origin, data } as MessageEvent));
}

const alertText = (renderer: ReactTestRenderer) =>
  renderer.root
    .findAll((node) => node.props.role === "alert" && node.type === "div")
    .map((node) =>
      node
        .findAll((child) => child.type === "p")
        .map((p) => p.children.join(""))
        .join(""),
    );
const buttons = (renderer: ReactTestRenderer) =>
  renderer.root.findAll((node) => node.type === "button");

describe("LiveViewFrame", () => {
  test("offers one retry for a network failure, then stops offering it", () => {
    const renderer = render();
    post({ type: "KERNEL_CONNECTION_FAILED", reason: "transport" });
    expect(alertText(renderer)).toEqual([
      DEFAULT_LOCALIZATION.humanInterventionLiveViewFailed!,
    ]);
    expect(buttons(renderer)).toHaveLength(1);

    act(() => buttons(renderer)[0]!.props.onClick());
    expect(alertText(renderer)).toEqual([]);

    post({ type: "KERNEL_CONNECTION_FAILED", reason: "transport" });
    expect(alertText(renderer)).toEqual([
      DEFAULT_LOCALIZATION.humanInterventionLiveViewGaveUp!,
    ]);
    expect(buttons(renderer)).toHaveLength(0);
    act(() => renderer.unmount());
  });

  test("does not offer a retry when the viewer's browser can't play the stream", () => {
    const renderer = render();
    post({ type: "KERNEL_CONNECTION_FAILED", reason: "unsupported" });
    expect(alertText(renderer)).toEqual([
      DEFAULT_LOCALIZATION.humanInterventionLiveViewUnsupported!,
    ]);
    expect(buttons(renderer)).toHaveLength(0);
    act(() => renderer.unmount());
  });

  test("ignores messages from other origins", () => {
    const renderer = render();
    post(
      { type: "KERNEL_CONNECTION_FAILED", reason: "transport" },
      "https://evil.example",
    );
    expect(alertText(renderer)).toEqual([]);
    act(() => renderer.unmount());
  });

  test("reloads a viewer that never plays, then reports it", async () => {
    const renderer = render(20);
    const iframes: unknown[] = [];
    for (let i = 0; i < 3; i++) {
      iframes.push(renderer.root.findByType("iframe" as never));
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 40));
      });
    }
    expect(new Set(iframes).size).toBe(3);
    expect(alertText(renderer)).toEqual([
      DEFAULT_LOCALIZATION.humanInterventionLiveViewGaveUp!,
    ]);
    expect(buttons(renderer)).toHaveLength(0);
    act(() => renderer.unmount());
  });

  test("a playing viewer is left alone", async () => {
    const renderer = render(20);
    post({ type: "KERNEL_PLAYING", playing: true });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60));
    });
    expect(alertText(renderer)).toEqual([]);
    act(() => renderer.unmount());
  });
});
