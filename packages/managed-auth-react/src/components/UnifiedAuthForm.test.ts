import { describe, expect, test } from "bun:test";
import { getAutocomplete } from "./UnifiedAuthForm";

describe("getAutocomplete", () => {
  test("uses the canonical field ref for username autocomplete", () => {
    expect(
      getAutocomplete({
        id: "field_opaque",
        ref: "username",
        name: "field_opaque",
        label: "Username",
        type: "text",
      }),
    ).toBe("username");
  });
});
