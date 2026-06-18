import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  chatRequestSchema,
  formatZodIssues,
  MAX_CHAT_MESSAGES,
} from "../../lib/validators/chat";

describe("chatRequestSchema", () => {
  it("accepts a valid chat request", () => {
    const result = chatRequestSchema.safeParse({
      mode: "study",
      messages: [{ role: "user", content: "Explain recursion." }],
    });

    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.mode, "study");
      assert.equal(result.data.messages[0].content, "Explain recursion.");
    }
  });

  it("rejects unknown modes and empty messages", () => {
    const result = chatRequestSchema.safeParse({
      mode: "bad",
      messages: [],
    });

    assert.equal(result.success, false);
    if (!result.success) {
      assert.deepEqual(formatZodIssues(result.error), [
        { path: "mode", message: "Unknown assistant mode." },
        { path: "messages", message: "At least one message is required." },
      ]);
    }
  });

  it("rejects blank message content", () => {
    const result = chatRequestSchema.safeParse({
      mode: "general",
      messages: [{ role: "user", content: "   " }],
    });

    assert.equal(result.success, false);
    if (!result.success) {
      assert.deepEqual(formatZodIssues(result.error), [
        { path: "messages.0.content", message: "Message content cannot be blank." },
      ]);
    }
  });

  it("limits the number of submitted messages", () => {
    const result = chatRequestSchema.safeParse({
      mode: "general",
      messages: Array.from({ length: MAX_CHAT_MESSAGES + 1 }, () => ({
        role: "user",
        content: "hello",
      })),
    });

    assert.equal(result.success, false);
    if (!result.success) {
      assert.deepEqual(formatZodIssues(result.error), [
        {
          path: "messages",
          message: `No more than ${MAX_CHAT_MESSAGES} messages allowed.`,
        },
      ]);
    }
  });
});
