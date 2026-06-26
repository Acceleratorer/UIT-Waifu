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
  runtime: ModeRuntime;
}

export interface StarterPrompt {
  label: string;
  prompt: string;
}

export type ModeRetrievalPolicy = "none" | "paste-only" | "future-rag";
export type ModeToolPolicy = "none" | "read-only" | "future-actions";
export type AvatarMood =
  | "ready"
  | "focused"
  | "analytical"
  | "curious"
  | "encouraging"
  | "strategic"
  | "warm";

export interface ModeRuntime {
  behavior: string;
  outputStyle: string;
  retrieval: ModeRetrievalPolicy;
  tools: ModeToolPolicy;
  avatar: {
    mood: AvatarMood;
    expression: string;
    motion: string;
  };
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
    runtime: {
      behavior: "Balanced companion support",
      outputStyle: "Clear, friendly, practical answers with examples when useful.",
      retrieval: "none",
      tools: "none",
      avatar: {
        mood: "ready",
        expression: "neutral",
        motion: "idle",
      },
    },
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
        label: "Generate examples",
        prompt:
          "Give me three concrete examples for this concept. Start simple, then show a realistic UIT-style example: ",
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
      {
        label: "Summarize lesson",
        prompt:
          "Summarize this lesson into key ideas, formulas or definitions, common traps, and a short self-check quiz:\n\n",
      },
    ],
    runtime: {
      behavior: "Tutor with hints before full answers",
      outputStyle: "Step-by-step explanations, examples, and short checks for understanding.",
      retrieval: "paste-only",
      tools: "read-only",
      avatar: {
        mood: "encouraging",
        expression: "thinking",
        motion: "focus",
      },
    },
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
      {
        label: "Refactor safely",
        prompt:
          "Refactor this code with the smallest safe improvement. Explain what changed and preserve behavior unless I ask otherwise:\n\n",
      },
      {
        label: "Review SQL",
        prompt:
          "Review this SQL query for correctness, readability, indexes, and obvious performance issues. Suggest a safer version if needed:\n\n",
      },
    ],
    runtime: {
      behavior: "Root-cause debugging and code review",
      outputStyle: "Precise analysis, fenced code blocks, minimal fixes, SQL notes, and complexity notes.",
      retrieval: "paste-only",
      tools: "read-only",
      avatar: {
        mood: "analytical",
        expression: "focused",
        motion: "focus",
      },
    },
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
    runtime: {
      behavior: "Grounded document question answering",
      outputStyle: "Source-aware answers that say when the provided material is insufficient.",
      retrieval: "future-rag",
      tools: "read-only",
      avatar: {
        mood: "focused",
        expression: "reading",
        motion: "focus",
      },
    },
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
    runtime: {
      behavior: "Exam prep coach",
      outputStyle: "Condensed summaries, quizzes, flashcards, and weak-spot drills.",
      retrieval: "paste-only",
      tools: "read-only",
      avatar: {
        mood: "focused",
        expression: "thinking",
        motion: "spark",
      },
    },
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
    runtime: {
      behavior: "Planning partner",
      outputStyle: "Milestones, next actions, risks, and realistic sequencing.",
      retrieval: "paste-only",
      tools: "future-actions",
      avatar: {
        mood: "strategic",
        expression: "confident",
        motion: "idle",
      },
    },
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
    runtime: {
      behavior: "Friendly check-in and focus support",
      outputStyle: "Warm, concise, supportive replies that still move the user forward.",
      retrieval: "none",
      tools: "none",
      avatar: {
        mood: "warm",
        expression: "happy",
        motion: "idle",
      },
    },
  },
];

export const MODE_IDS: ModeId[] = MODES.map((m) => m.id);

export function getModeById(id: ModeId): Mode {
  return MODES.find((m) => m.id === id) ?? MODES[0];
}

export function isModeId(value: unknown): value is ModeId {
  return typeof value === "string" && (MODE_IDS as string[]).includes(value);
}
