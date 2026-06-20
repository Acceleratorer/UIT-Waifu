import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeStoredMessages } from "../../features/chat/preferences";

describe("chat preferences", () => {
  it("normalizes saved messages from local storage", () => {
    assert.deepEqual(
      normalizeStoredMessages([
        { role: "user", content: "hello" },
        { role: "assistant", content: "hi" },
        { role: "system", content: "ignore" },
        { role: "user", content: "" },
        { role: "assistant", content: 123 },
        null,
      ]),
      [
        { role: "user", content: "hello" },
        { role: "assistant", content: "hi" },
      ]
    );
  });

  it("limits restored message count and content length", () => {
    const longContent = "x".repeat(12_005);
    const messages = Array.from({ length: 55 }, (_, index) => ({
      role: index % 2 === 0 ? "user" : "assistant",
      content: index === 54 ? longContent : `message ${index}`,
    }));

    const result = normalizeStoredMessages(messages);

    assert.equal(result.length, 50);
    assert.equal(result[0].content, "message 5");
    assert.equal(result[49].content.length, 12_000);
  });

  it("ignores non-array storage payloads", () => {
    assert.deepEqual(normalizeStoredMessages({ role: "user", content: "nope" }), []);
  });
});
