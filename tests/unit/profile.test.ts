import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildProfileUpsertRow,
  normalizeProfileRow,
} from "../../features/profile/profile";

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
});
