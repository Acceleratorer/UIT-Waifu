import { getModeById, type ModeId } from "../../data/modes";
import { BASE_PERSONALITY, SAFETY_FOOTER } from "./base";
import { STUDY_PROMPT } from "./study";
import { CODE_PROMPT } from "./code";
import { DOCUMENT_PROMPT } from "./document";
import { REVISION_PROMPT } from "./revision";
import { PROJECT_PROMPT } from "./project";
import { COMPANION_PROMPT } from "./companion";

const MODE_TEMPLATES: Record<ModeId, string> = {
  general: "",
  study: STUDY_PROMPT,
  code: CODE_PROMPT,
  document: DOCUMENT_PROMPT,
  revision: REVISION_PROMPT,
  project: PROJECT_PROMPT,
  companion: COMPANION_PROMPT,
};

function composeRuntimeGuidance(mode: ModeId): string {
  const runtime = getModeById(mode).runtime;

  return `Mode runtime guidance:
- Behavior: ${runtime.behavior}
- Answer style: ${runtime.outputStyle}
- Retrieval policy: ${runtime.retrieval}
- Tool policy: ${runtime.tools}
- Avatar stage hint: mood=${runtime.avatar.mood}, expression=${runtime.avatar.expression}, motion=${runtime.avatar.motion}. This hint is for UI state only; do not narrate it unless the user asks about the interface.`;
}

export function composeSystemPrompt(mode: ModeId): string {
  return [BASE_PERSONALITY, MODE_TEMPLATES[mode], composeRuntimeGuidance(mode), SAFETY_FOOTER]
    .filter(Boolean)
    .join("\n\n");
}
