import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildProfileUpsertRow,
  normalizeProfileRow,
} from "../../features/profile/profile";
import {
  buildAccountDataDeleteTargets,
  buildAccountDataExport,
} from "../../features/profile/account-data";

describe("profile helpers", () => {
  it("normalizes profile rows for the settings form", () => {
    assert.deepEqual(
      normalizeProfileRow({
        display_name: "  Nguyen   An  ",
        major: "  Computer   Science ",
        year: 3,
      }),
      {
        displayName: "Nguyen An",
        major: "Computer Science",
        year: "3",
      }
    );

    assert.deepEqual(normalizeProfileRow(null), {
      displayName: "",
      major: "",
      year: "",
    });
  });

  it("builds safe profile upsert rows", () => {
    assert.deepEqual(
      buildProfileUpsertRow("user-id", {
        displayName: "  Linh   Tran ",
        major: "  Software Engineering ",
        year: "2",
      }),
      {
        user_id: "user-id",
        display_name: "Linh Tran",
        major: "Software Engineering",
        year: 2,
      }
    );

    assert.deepEqual(
      buildProfileUpsertRow("user-id", {
        displayName: "",
        major: "",
        year: "99",
      }),
      {
        user_id: "user-id",
        display_name: null,
        major: null,
        year: null,
      }
    );
  });

  it("builds account data deletion targets", () => {
    assert.deepEqual(buildAccountDataDeleteTargets("user-id"), [
      { table: "profiles", column: "user_id", value: "user-id" },
      { table: "conversations", column: "user_id", value: "user-id" },
    ]);
  });

  it("builds account data exports with grouped messages", () => {
    assert.deepEqual(
      buildAccountDataExport({
        exportedAt: "2026-07-17T13:00:00.000Z",
        profile: {
          display_name: "Linh Tran",
          major: "Software Engineering",
          year: 2,
          created_at: "2026-07-01T00:00:00.000Z",
          updated_at: "2026-07-02T00:00:00.000Z",
        },
        conversations: [
          {
            id: "conversation-1",
            title: "Exam prep",
            mode: "study",
            created_at: "2026-07-03T00:00:00.000Z",
            updated_at: "2026-07-04T00:00:00.000Z",
          },
          { title: "missing id" },
        ],
        messages: [
          {
            conversation_id: "conversation-1",
            role: "user",
            content: "hello",
            created_at: "2026-07-03T00:01:00.000Z",
          },
          {
            conversation_id: "conversation-1",
            role: "assistant",
            content: "hi",
            created_at: "2026-07-03T00:02:00.000Z",
          },
          {
            conversation_id: "unknown",
            role: "user",
            content: "ignored by missing conversation",
          },
        ],
      }),
      {
        exportedAt: "2026-07-17T13:00:00.000Z",
        profile: {
          displayName: "Linh Tran",
          major: "Software Engineering",
          year: 2,
          createdAt: "2026-07-01T00:00:00.000Z",
          updatedAt: "2026-07-02T00:00:00.000Z",
        },
        conversations: [
          {
            id: "conversation-1",
            title: "Exam prep",
            mode: "study",
            createdAt: "2026-07-03T00:00:00.000Z",
            updatedAt: "2026-07-04T00:00:00.000Z",
            messages: [
              {
                role: "user",
                content: "hello",
                createdAt: "2026-07-03T00:01:00.000Z",
              },
              {
                role: "assistant",
                content: "hi",
                createdAt: "2026-07-03T00:02:00.000Z",
              },
            ],
          },
        ],
      }
    );
  });
});
