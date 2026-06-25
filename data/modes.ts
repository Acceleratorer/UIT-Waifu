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
  starters: StarterPrompt[];
}

export interface StarterPrompt {
  label: string;
  prompt: string;
}

export const DEFAULT_MODE: ModeId = "general";

export const MODES: Mode[] = [
  {
    id: "general",
    label: "General",
    description: "Open-ended chat, no specialization.",
    starters: [
      {
        label: "Plan my study week",
        prompt:
          "Help me plan a realistic study week. Ask me about my subjects, deadlines, and available time first.",
      },
      {
        label: "Explain a concept",
        prompt:
          "Explain this concept in simple terms, then give one concrete example: ",
      },
    ],
  },
  {
    id: "study",
    label: "Study",
    description: "Step-by-step tutoring, hints before answers.",
    starters: [
      {
        label: "Teach step by step",
        prompt:
          "Teach me this topic step by step. Start with what I need to know first: ",
      },
      {
        label: "Give practice questions",
        prompt:
          "Generate five practice questions for this topic. Start easy, then increase difficulty: ",
      },
      {
        label: "Hint before answer",
        prompt:
          "Give me a hint first, then wait before revealing the full solution: ",
      },
    ],
  },
  {
    id: "code",
    label: "Code",
    description: "Debug, explain, refactor, and review code.",
    starters: [
      {
        label: "Debug this error",
        prompt:
          "Debug this error. Explain the root cause, then suggest the smallest fix:\n\n",
      },
      {
        label: "Explain this code",
        prompt:
          "Explain what this code does, including the main data flow and edge cases:\n\n",
      },
      {
        label: "Review complexity",
        prompt:
          "Analyze the time and space complexity of this solution, then suggest one improvement if useful:\n\n",
      },
    ],
  },
  {
    id: "document",
    label: "Document",
    description: "Answer from your uploaded documents (RAG, Phase 4).",
    starters: [
      {
        label: "Summarize notes",
        prompt:
          "Summarize these notes into key ideas, definitions, and likely exam points:\n\n",
      },
      {
        label: "Find missing info",
        prompt:
          "Based only on the document text I paste, answer my question and say when the answer is not present:\n\nQuestion: ",
      },
    ],
  },
  {
    id: "revision",
    label: "Revision",
    description: "Exam revision: summaries, quizzes, flashcards.",
    starters: [
      {
        label: "Make flashcards",
        prompt:
          "Turn this material into concise flashcards with question and answer pairs:\n\n",
      },
      {
        label: "Quiz me",
        prompt:
          "Quiz me on this topic one question at a time. Wait for my answer before grading: ",
      },
      {
        label: "Exam cram sheet",
        prompt:
          "Create a one-page exam revision sheet for this topic with formulas, traps, and examples: ",
      },
    ],
  },
  {
    id: "project",
    label: "Project",
    description: "Study plans and project roadmaps.",
    starters: [
      {
        label: "Build a roadmap",
        prompt:
          "Create a practical project roadmap. Ask about deadline, team size, stack, and current progress first.",
      },
      {
        label: "Break down tasks",
        prompt:
          "Break this project into milestones, tasks, risks, and what I should do today:\n\n",
      },
    ],
  },
  {
    id: "companion",
    label: "Companion",
    description: "Lightweight friendly chat, more personality.",
    starters: [
      {
        label: "Check in",
        prompt:
          "Check in with me about my study mood today and help me choose one small next step.",
      },
      {
        label: "Reset my focus",
        prompt:
          "Help me reset my focus in five minutes, then pick a simple study task to start.",
      },
    ],
  },
];

export const MODE_IDS: ModeId[] = MODES.map((m) => m.id);

export function isModeId(value: unknown): value is ModeId {
  return typeof value === "string" && (MODE_IDS as string[]).includes(value);
}
