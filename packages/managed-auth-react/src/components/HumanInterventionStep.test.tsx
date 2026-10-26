import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createElement } from "react";
import { act, create } from "react-test-renderer";
import { AppearanceProvider } from "../appearance/context";
import { LocalizationProvider } from "../localization/context";
import { HumanInterventionStep } from "./HumanInterventionStep";

function render(note?: string) {
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      createElement(
        AppearanceProvider,
        null,
        createElement(
          LocalizationProvider,
          null,
          createElement(HumanInterventionStep, {
            targetDomain: "example.com",
            liveViewUrl: "https://live.example.com/browser/live/abc",
            onDone: () => {},
            note,
          }),
        ),
      ),
    );
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
        window: { addEventListener() {}, removeEventListener() {} },
      });
    }
  });
  afterAll(() => {
    if (!hadWindow) delete (globalThis as { window?: unknown }).window;
  });

  test("shows the note when the site asks again", () => {
    const note = "The site is asking for a security check again.";
    expect(statusText(render(note))).toEqual([note]);
  });

  test("shows no note on the first pause", () => {
    expect(statusText(render())).toEqual([]);
  });
});
