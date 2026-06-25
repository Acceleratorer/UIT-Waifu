import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_MODE, MODE_IDS, MODES, isModeId } from "../../data/modes";

describe("assistant modes", () => {
  it("keeps mode ids unique and validates the default mode", () => {
    assert.equal(new Set(MODE_IDS).size, MODE_IDS.length);
    assert.equal(isModeId(DEFAULT_MODE), true);
    assert.equal(isModeId("bad-mode"), false);
  });

  it("defines useful starter prompts for every mode", () => {
    for (const mode of MODES) {
      assert.ok(mode.starters.length >= 2, `${mode.id} has too few starters`);

      for (const starter of mode.starters) {
        assert.ok(starter.label.trim().length > 0, `${mode.id} has a blank label`);
        assert.ok(
          starter.prompt.trim().length >= 20,
          `${mode.id} has a starter prompt that is too short`
        );
      }
    }
  });
});
