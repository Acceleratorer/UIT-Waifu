export type ModeId =
  | "general"
  | "study"
  | "code"
  | "document"
  | "revision"
  | "project"
  | "companion";

export interface Mode {
  id: ModeId;
  label: string;
  description: string;
}

export const DEFAULT_MODE: ModeId = "general";

export const MODES: Mode[] = [
  { id: "general", label: "General", description: "Open-ended chat, no specialization." },
  { id: "study", label: "Study", description: "Step-by-step tutoring, hints before answers." },
  { id: "code", label: "Code", description: "Debug, explain, refactor, and review code." },
  { id: "document", label: "Document", description: "Answer from your uploaded documents (RAG, Phase 4)." },
  { id: "revision", label: "Revision", description: "Exam revision: summaries, quizzes, flashcards." },
  { id: "project", label: "Project", description: "Study plans and project roadmaps." },
  { id: "companion", label: "Companion", description: "Lightweight friendly chat, more personality." },
];

export const MODE_IDS: ModeId[] = MODES.map((m) => m.id);

export function isModeId(value: unknown): value is ModeId {
  return typeof value === "string" && (MODE_IDS as string[]).includes(value);
}
