import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MODES } from "../../data/modes";
import { composeSystemPrompt } from "../../lib/prompts/compose";

describe("system prompts", () => {
  it("builds a prompt for every assistant mode", () => {
    for (const mode of MODES) {
      const prompt = composeSystemPrompt(mode.id);
      assert.match(prompt, /You are UIT Waifu/);
      assert.match(prompt, /Stay accurate/);
    }
  });

  it("uses a dedicated revision prompt", () => {
    const prompt = composeSystemPrompt("revision");

    assert.match(prompt, /exam revision mode/);
    assert.match(prompt, /flashcards/);
    assert.doesNotMatch(prompt, /study tutor mode/);
  });
});
