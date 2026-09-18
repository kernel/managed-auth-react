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

  test("uses input modes for dedicated email and telephone autofill", () => {
    expect(
      getAutocomplete({
        name: "field_email",
        label: "Email address",
        type: "text",
        input_mode: "email",
      }),
    ).toBe("email");
    expect(
      getAutocomplete({
        name: "field_phone",
        label: "Phone number",
        type: "text",
        input_mode: "tel",
      }),
    ).toBe("tel");
    expect(
      getAutocomplete({
        ref: "username",
        name: "field_identifier",
        label: "Account identifier",
        type: "text",
        input_mode: "email",
      }),
    ).toBe("email");
  });

  test("keeps one-time-code autocomplete ahead of keyboard hints", () => {
    expect(
      getAutocomplete({
        name: "field_code",
        label: "Verification code",
        type: "code",
        input_mode: "tel",
      }),
    ).toBe("one-time-code");
  });

  test("does not infer email autofill for mixed identifier inputs", () => {
    expect(
      getAutocomplete({
        ref: "email",
        name: "field_identifier",
        label: "Mobile number, username, or email",
        type: "text",
        input_mode: "text",
      }),
    ).toBeUndefined();
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
    expect(input.props.autoComplete).toBe("email");

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

describe("browser autofill and pending submission", () => {
  test("submits current controls without requiring change events and locks both input variants", () => {
    const original = globalThis.FormData;
    let received: Record<string, string> | undefined;
    let renderer!: ReturnType<typeof create>;
    const currentForm = {};
    // Model browser FormData: values can arrive without any React onChange.
    globalThis.FormData = class {
      constructor(form: unknown) { expect(form).toBe(currentForm); }
      get(name: string) { return name === "password" ? "autofilled-password" : "autofilled-identifier"; }
    } as unknown as typeof FormData;
    const render = (isLoading: boolean) => createElement(AppearanceProvider, {
      children: createElement(LocalizationProvider, {
        children: createElement(UnifiedAuthForm, {
          targetDomain: "example.com", isLoading,
          fields: [
            { name: "identifier", label: "Identifier", type: "text" },
            { name: "password", label: "Password", type: "password" },
          ],
          onSubmitFields: values => { received = values; },
          onSSOClick: () => {}, onMFASelect: () => {}, onSignInOptionSelect: () => {},
        }),
      }),
    });
    try {
      act(() => { renderer = create(render(false)); });
      act(() => renderer.root.findByType("form").props.onSubmit({ preventDefault() {}, currentTarget: currentForm }));
      expect(received).toEqual({ identifier: "autofilled-identifier", password: "autofilled-password" });
      act(() => renderer.update(render(true)));
      for (const input of renderer.root.findAllByType("input")) {
        expect(input.props.readOnly).toBe(true);
        expect(input.props.disabled).not.toBe(true);
      }
      received = undefined;
      act(() => renderer.root.findByType("form").props.onSubmit({ preventDefault() {}, currentTarget: currentForm }));
      expect(received).toBeUndefined();
    } finally {
      globalThis.FormData = original;
      act(() => renderer.unmount());
    }
  });
});
