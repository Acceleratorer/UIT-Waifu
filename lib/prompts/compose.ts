import type { ModeId } from "../../data/modes";
import { BASE_PERSONALITY, SAFETY_FOOTER } from "./base";
import { STUDY_PROMPT } from "./study";
import { CODE_PROMPT } from "./code";
import { DOCUMENT_PROMPT } from "./document";
import { PROJECT_PROMPT } from "./project";
import { COMPANION_PROMPT } from "./companion";

const MODE_TEMPLATES: Record<ModeId, string> = {
  general: "",
  study: STUDY_PROMPT,
  code: CODE_PROMPT,
  document: DOCUMENT_PROMPT,
  revision: STUDY_PROMPT,
  project: PROJECT_PROMPT,
  companion: COMPANION_PROMPT,
};

export function composeSystemPrompt(mode: ModeId): string {
  return [BASE_PERSONALITY, MODE_TEMPLATES[mode], SAFETY_FOOTER]
    .filter(Boolean)
    .join("\n\n");
}
