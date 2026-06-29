import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildMessageRows,
  createConversationTitle,
} from "../../features/chat/remote-history";

describe("chat remote history", () => {
  it("creates compact conversation titles from user messages", () => {
    assert.equal(createConversationTitle("   Explain   recursion\nin C++   "), "Explain recursion in C++");
    assert.equal(createConversationTitle("   "), "New conversation");

    const longTitle = createConversationTitle("x".repeat(80));
    assert.equal(longTitle.length, 64);
    assert.equal(longTitle.endsWith("..."), true);
  });

  it("builds Supabase message insert rows", () => {
    assert.deepEqual(
      buildMessageRows("conversation-id", [
        { role: "user", content: "hello" },
        { role: "assistant", content: "hi" },
      ]),
      [
        {
          conversation_id: "conversation-id",
          role: "user",
          content: "hello",
        },
        {
          conversation_id: "conversation-id",
          role: "assistant",
          content: "hi",
        },
      ]
    );
  });
});
