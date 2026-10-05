import { describe, expect, test } from "bun:test";
import { extractPrimaryDomainLabel } from "./profile-name";

describe("extractPrimaryDomainLabel", () => {
  test("uses the registrable domain for subdomains of multi-label suffixes", () => {
    expect(extractPrimaryDomainLabel("login.clalit.co.il")).toBe("clalit");
    expect(extractPrimaryDomainLabel("auth.example.co.uk")).toBe("example");
  });

  test("uses the registrable domain for regular suffixes", () => {
    expect(extractPrimaryDomainLabel("login.example.com")).toBe("example");
    expect(extractPrimaryDomainLabel("example.com")).toBe("example");
  });
});
