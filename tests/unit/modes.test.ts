import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_MODE,
  MODE_IDS,
  MODES,
  getModeById,
  isModeId,
} from "../../data/modes";

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

  it("defines runtime behavior for every mode", () => {
    const retrievalPolicies = new Set(["none", "paste-only", "future-rag"]);
    const toolPolicies = new Set(["none", "read-only", "future-actions"]);

    for (const mode of MODES) {
      assert.ok(mode.runtime.behavior.length >= 12, `${mode.id} has weak behavior`);
      assert.ok(
        mode.runtime.outputStyle.length >= 20,
        `${mode.id} has weak output style`
      );
      assert.ok(
        retrievalPolicies.has(mode.runtime.retrieval),
        `${mode.id} has an unknown retrieval policy`
      );
      assert.ok(
        toolPolicies.has(mode.runtime.tools),
        `${mode.id} has an unknown tool policy`
      );
      assert.ok(mode.runtime.avatar.mood, `${mode.id} is missing avatar mood`);
      assert.ok(
        mode.runtime.avatar.expression,
        `${mode.id} is missing avatar expression`
      );
      assert.ok(mode.runtime.avatar.motion, `${mode.id} is missing avatar motion`);
    }
  });

  it("resolves modes through the registry helper", () => {
    assert.equal(getModeById(DEFAULT_MODE).id, DEFAULT_MODE);
    assert.equal(getModeById("code").runtime.avatar.mood, "analytical");
    assert.equal(getModeById("document").runtime.retrieval, "future-rag");
  });

  it("exposes Phase 2 study and code workflows as starters", () => {
    const studyLabels = new Set(getModeById("study").starters.map((s) => s.label));
    const codeLabels = new Set(getModeById("code").starters.map((s) => s.label));

    for (const label of [
      "Teach step by step",
      "Generate examples",
      "Give practice questions",
      "Hint before answer",
      "Summarize lesson",
    ]) {
      assert.equal(studyLabels.has(label), true, `study missing ${label}`);
    }

    for (const label of [
      "Debug this error",
      "Explain this code",
      "Review complexity",
      "Refactor safely",
      "Review SQL",
    ]) {
      assert.equal(codeLabels.has(label), true, `code missing ${label}`);
    }
  });
});
