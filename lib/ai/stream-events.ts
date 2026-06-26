export type ChatRuntimeState = "idle" | "thinking" | "streaming" | "speaking" | "error";

export type AvatarExpression =
  | "neutral"
  | "happy"
  | "thinking"
  | "surprised"
  | "sad";

export type AvatarEventSource = "mode" | "assistant" | "voice" | "system";

export type ChatStreamEvent =
  | { type: "delta"; delta: string }
  | { type: "state"; state: ChatRuntimeState; message?: string }
  | {
      type: "avatar";
      state: ChatRuntimeState;
      expression?: AvatarExpression;
      intensity?: number;
      source: AvatarEventSource;
    }
  | {
      type: "source";
      id?: string;
      documentId?: string;
      title?: string;
      page?: number;
      snippet?: string;
      score?: number;
    }
  | { type: "memory"; action: "read" | "write" | "delete"; id?: string; label?: string }
  | { type: "done" }
  | { type: "error"; code?: string; message: string };

export function serializeChatStreamEvent(event: ChatStreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export function parseChatStreamData(data: string): ChatStreamEvent | null {
  const trimmed = data.trim();
  if (!trimmed) return null;
  if (trimmed === "[DONE]") return { type: "done" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;
  const payload = parsed as Record<string, unknown>;

  if (payload.type === "delta" && typeof payload.delta === "string") {
    return { type: "delta", delta: payload.delta };
  }

  if (!payload.type && typeof payload.delta === "string") {
    return { type: "delta", delta: payload.delta };
  }

  if (payload.type === "done") return { type: "done" };

  if (payload.type === "error" && typeof payload.message === "string") {
    return {
      type: "error",
      code: typeof payload.code === "string" ? payload.code : undefined,
      message: payload.message,
    };
  }

  if (payload.type === "state" && isRuntimeState(payload.state)) {
    return {
      type: "state",
      state: payload.state,
      message: typeof payload.message === "string" ? payload.message : undefined,
    };
  }

  if (
    payload.type === "avatar" &&
    isRuntimeState(payload.state) &&
    isAvatarEventSource(payload.source)
  ) {
    return {
      type: "avatar",
      state: payload.state,
      expression: isAvatarExpression(payload.expression)
        ? payload.expression
        : undefined,
      intensity: typeof payload.intensity === "number" ? payload.intensity : undefined,
      source: payload.source,
    };
  }

  if (payload.type === "source") {
    return {
      type: "source",
      id: stringValue(payload.id),
      documentId: stringValue(payload.documentId),
      title: stringValue(payload.title),
      page: numberValue(payload.page),
      snippet: stringValue(payload.snippet),
      score: numberValue(payload.score),
    };
  }

  if (
    payload.type === "memory" &&
    (payload.action === "read" ||
      payload.action === "write" ||
      payload.action === "delete")
  ) {
    return {
      type: "memory",
      action: payload.action,
      id: stringValue(payload.id),
      label: stringValue(payload.label),
    };
  }

  return null;
}

function isRuntimeState(value: unknown): value is ChatRuntimeState {
  return (
    value === "idle" ||
    value === "thinking" ||
    value === "streaming" ||
    value === "speaking" ||
    value === "error"
  );
}

function isAvatarExpression(value: unknown): value is AvatarExpression {
  return (
    value === "neutral" ||
    value === "happy" ||
    value === "thinking" ||
    value === "surprised" ||
    value === "sad"
  );
}

function isAvatarEventSource(value: unknown): value is AvatarEventSource {
  return (
    value === "mode" ||
    value === "assistant" ||
    value === "voice" ||
    value === "system"
  );
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}
