import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { act, create } from "react-test-renderer";
import { AppearanceProvider } from "../appearance/context";
import { LocalizationProvider } from "../localization/context";
import { getAutocomplete, UnifiedAuthForm } from "./UnifiedAuthForm";

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

describe("UnifiedAuthForm", () => {
  test("applies a keyboard hint without enabling native format validation", () => {
    let renderer!: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        createElement(AppearanceProvider, {
          children: createElement(LocalizationProvider, {
            children: createElement(UnifiedAuthForm, {
              targetDomain: "example.com",
              fields: [
                {
                  name: "field_email",
                  label: "Email address",
                  type: "text",
                  input_mode: "email",
                },
              ],
              onSubmitFields: () => {},
              onSSOClick: () => {},
              onMFASelect: () => {},
              onSignInOptionSelect: () => {},
            }),
          }),
        }),
      );
    });

    const input = renderer.root.findByType("input");
    expect(input.props.type).toBe("text");
    expect(input.props.inputMode).toBe("email");

    act(() => renderer.unmount());
  });

  test("renders an accessible, customizable rejection notice", () => {
    const fieldName = "password-field";
    const rejectedNoticeId = `${fieldName}-rejected-notice`;
    const hintId = `${fieldName}-hint`;
    let renderer!: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        createElement(AppearanceProvider, {
          appearance: {
            elements: { inputRejectedNotice: "custom-rejection" },
          },
          children: createElement(LocalizationProvider, {
            localization: {
              fieldRejectedNotice: "That value was rejected",
            },
            children: createElement(UnifiedAuthForm, {
              targetDomain: "example.com",
              fields: [
                {
                  name: fieldName,
                  label: "Password",
                  type: "password",
                  reason: "rejected",
                  hint: "Use your current password",
                },
              ],
              onSubmitFields: () => {},
              onSSOClick: () => {},
              onMFASelect: () => {},
              onSignInOptionSelect: () => {},
            }),
          }),
        }),
      );
    });

    const input = renderer.root.findByType("input");
    const notice = renderer.root.findByProps({
      "data-kma-element": "inputRejectedNotice",
    });
    const hint = renderer.root.findByProps({
      "data-kma-element": "inputHint",
    });

    expect(input.props["aria-describedby"]).toBe(
      `${rejectedNoticeId} ${hintId}`,
    );
    expect(notice.props.id).toBe(rejectedNoticeId);
    expect(notice.props.role).toBe("status");
    expect(notice.props.className).toContain("custom-rejection");
    expect(notice.children).toEqual(["That value was rejected"]);
    expect(hint.props.id).toBe(hintId);

    act(() => renderer.unmount());
  });
});
