import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildConversationRenamePatch,
  buildMessageRows,
  createConversationTitle,
  normalizeRemoteConversationRow,
  normalizeRemoteMessageRow,
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

  it("builds normalized conversation rename patches", () => {
    assert.deepEqual(
      buildConversationRenamePatch(
        "   New   plan\nfor OS exam   ",
        "2026-07-17T08:00:00.000Z"
      ),
      {
        title: "New plan for OS exam",
        updated_at: "2026-07-17T08:00:00.000Z",
      }
    );

    assert.equal(buildConversationRenamePatch("x".repeat(80)).title.length, 64);
  });

  it("normalizes remote conversation rows defensively", () => {
    assert.deepEqual(
      normalizeRemoteConversationRow({
        id: "conversation-id",
        title: "  Study calculus  ",
        mode: "study",
        updated_at: "2026-06-29T10:00:00.000Z",
      }),
      {
        id: "conversation-id",
        title: "Study calculus",
        mode: "study",
        updatedAt: "2026-06-29T10:00:00.000Z",
      }
    );

    assert.deepEqual(
      normalizeRemoteConversationRow({
        id: "conversation-id",
        title: "",
        mode: "unknown",
        created_at: "2026-06-29T09:00:00.000Z",
      }),
      {
        id: "conversation-id",
        title: "New conversation",
        mode: "general",
        updatedAt: "2026-06-29T09:00:00.000Z",
      }
    );

    assert.equal(normalizeRemoteConversationRow({ title: "missing id" }), null);
  });

  it("normalizes remote message rows for the chat UI", () => {
    assert.deepEqual(
      normalizeRemoteMessageRow({ role: "assistant", content: "hello" }),
      { role: "assistant", content: "hello" }
    );
    assert.equal(
      normalizeRemoteMessageRow({ role: "system", content: "ignore" }),
      null
    );
    assert.equal(normalizeRemoteMessageRow({ role: "user", content: 123 }), null);
  });
});
