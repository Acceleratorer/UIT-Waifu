import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MODES } from "../../data/modes";
import { composeSystemPrompt } from "../../lib/prompts/compose";

describe("system prompts", () => {
  it("builds a prompt for every assistant mode", () => {
    for (const mode of MODES) {
      const prompt = composeSystemPrompt(mode.id);
      assert.match(prompt, /You are UIT Waifu/);
      assert.match(prompt, /Mode runtime guidance/);
      assert.match(prompt, new RegExp(escapeRegExp(mode.runtime.behavior)));
      assert.match(prompt, new RegExp(escapeRegExp(mode.runtime.outputStyle)));
      assert.match(prompt, /Stay accurate/);
    }
  });

  it("includes mode runtime policies in composed prompts", () => {
    const documentPrompt = composeSystemPrompt("document");
    const projectPrompt = composeSystemPrompt("project");

    assert.match(documentPrompt, /Retrieval policy: future-rag/);
    assert.match(documentPrompt, /Tool policy: read-only/);
    assert.match(projectPrompt, /Tool policy: future-actions/);
    assert.match(projectPrompt, /Avatar stage hint: mood=strategic/);
    assert.doesNotMatch(projectPrompt, /undefined/);
  });

  it("uses a dedicated revision prompt", () => {
    const prompt = composeSystemPrompt("revision");

    assert.match(prompt, /exam revision mode/);
    assert.match(prompt, /flashcards/);
    assert.doesNotMatch(prompt, /study tutor mode/);
  });

  it("covers Phase 2 study and code behaviors in prompts", () => {
    const studyPrompt = composeSystemPrompt("study");
    const codePrompt = composeSystemPrompt("code");

    assert.match(studyPrompt, /concrete examples/);
    assert.match(studyPrompt, /self-check quiz/);
    assert.match(codePrompt, /SQL/);
    assert.match(codePrompt, /preserve behavior/);
    assert.match(codePrompt, /time complexity/);
  });
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
