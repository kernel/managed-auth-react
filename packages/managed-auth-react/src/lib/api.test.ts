import { describe, expect, test } from "bun:test";
import { ManagedAuthApiError, submitManagedAuth } from "./api";

describe("submitManagedAuth", () => {
  test("preserves structured API error codes", async () => {
    const fetch = async () =>
      new Response(
        JSON.stringify({
          code: "stale_interaction",
          message: "Refresh the flow state and try again.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );

    try {
      await submitManagedAuth(
        "connection-id",
        "jwt",
        {
          interaction_id: "mai_previous",
          field_values: { field_password: "secret" },
        },
        { fetch: fetch as unknown as typeof globalThis.fetch },
      );
      throw new Error("expected submitManagedAuth to reject");
    } catch (error) {
      expect(error).toBeInstanceOf(ManagedAuthApiError);
      expect((error as ManagedAuthApiError).code).toBe("stale_interaction");
      expect((error as ManagedAuthApiError).message).toBe(
        "Refresh the flow state and try again.",
      );
    }
  });
});
