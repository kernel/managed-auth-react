import { expect, test } from "bun:test";
import type {
  ConnectionFollowResponse,
  ConnectionSubmitParams,
  ManagedAuth as SDKManagedAuth,
} from "@onkernel/sdk/resources/auth/connections";
import type { ManagedAuthSubmitBody } from "./api";
import type { ManagedAuthChoice, ManagedAuthField } from "./types";

type Equal<Left, Right> = [Left] extends [Right]
  ? [Right] extends [Left]
    ? true
    : false
  : false;

test("canonical protocol types match @onkernel/sdk", () => {
  type SDKStateEvent = Extract<
    ConnectionFollowResponse,
    { event: "managed_auth_state" }
  >;
  type SDKEventField = NonNullable<SDKStateEvent["fields"]>[number];
  type SDKEventChoice = NonNullable<SDKStateEvent["choices"]>[number];

  const fieldMatches: Equal<ManagedAuthField, SDKManagedAuth.Field> = true;
  const choiceMatches: Equal<ManagedAuthChoice, SDKManagedAuth.Choice> = true;
  const eventFieldMatches: Equal<ManagedAuthField, SDKEventField> = true;
  const eventChoiceMatches: Equal<ManagedAuthChoice, SDKEventChoice> = true;
  const submitMatches: ManagedAuthSubmitBody extends ConnectionSubmitParams
    ? true
    : false = true;

  expect([
    fieldMatches,
    choiceMatches,
    eventFieldMatches,
    eventChoiceMatches,
    submitMatches,
  ]).toEqual([true, true, true, true, true]);
});
