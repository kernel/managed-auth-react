import { afterEach, describe, expect, test } from "bun:test";
import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import type { ManagedAuthResponse } from "../lib/types";
import {
  useManagedAuthSession,
  type ManagedAuthSessionValue,
} from "./useManagedAuthSession";

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const humanInterventionState: ManagedAuthResponse = {
  id: "session-id",
  domain: "example.com",
  profile_name: "profile",
  flow_status: "IN_PROGRESS",
  flow_step: "AWAITING_HUMAN_INTERVENTION",
  interaction_id: "mai_captcha",
  live_view_url: "https://live.example.com/browser/live/abc",
  fields: [],
  choices: [
    {
      id: "human_intervention_done",
      type: "human_intervention",
      label: "I've completed the security check",
    },
  ],
};

let renderer: ReactTestRenderer | null = null;

afterEach(() => {
  if (renderer) {
    act(() => renderer?.unmount());
    renderer = null;
  }
});

async function renderSession(submitResponse: Response) {
  const submissions: unknown[] = [];
  let value: ManagedAuthSessionValue | null = null;

  const fetchImpl = (async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const url = String(input);
    if (url.endsWith("/exchange")) return response({ jwt: "jwt" });
    if (url.endsWith("/events")) return new Promise<Response>(() => {});
    if (url.endsWith("/submit")) {
      submissions.push(JSON.parse(String(init?.body)));
      return submitResponse;
    }
    if (init?.method === "GET") return response(humanInterventionState);
    throw new Error(`Unexpected request: ${init?.method} ${url}`);
  }) as typeof fetch;

  function Harness() {
    value = useManagedAuthSession({
      sessionId: "session-id",
      handoffCode: "handoff-code",
      autoStart: true,
      fetch: fetchImpl,
    });
    return null;
  }

  await act(async () => {
    renderer = create(createElement(Harness));
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });

  return {
    submissions,
    get value() {
      if (!value) throw new Error("Session hook did not render");
      return value;
    },
  };
}

describe("useManagedAuthSession human intervention", () => {
  test("pauses on the human intervention step and keeps it out of sign-in options", async () => {
    const session = await renderSession(response({}));

    expect(session.value.uiState).toBe("awaiting_human_intervention");
    expect(session.value.state?.sign_in_options).toBeNull();
  });

  test("submits the done choice for the current interaction", async () => {
    const session = await renderSession(response({}));

    await act(async () => {
      await session.value.completeHumanIntervention();
    });

    expect(session.submissions).toEqual([
      {
        interaction_id: "mai_captcha",
        selected_choice_id: "human_intervention_done",
      },
    ]);
  });

  test("returns to the live view when the submit fails", async () => {
    const session = await renderSession(
      response({ code: "internal_error", message: "try again" }, 500),
    );

    await act(async () => {
      await session.value.completeHumanIntervention();
    });

    expect(session.value.uiState).toBe("awaiting_human_intervention");
    expect(session.value.submitError).toBeTruthy();
  });
});
