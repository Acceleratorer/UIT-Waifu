import type { ChatMessage } from "../validators/chat";

export type ChatProvider = "openrouter" | "anthropic";

export interface ChatProviderEnv {
  AI_PROVIDER?: string;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  ANTHROPIC_API_KEY?: string;
  ANTHROPIC_MODEL?: string;
  APP_URL?: string;
}

const DEFAULT_OPENROUTER_MODEL = "google/gemini-2.0-flash-001";
const DEFAULT_ANTHROPIC_MODEL = "claude-haiku-4-5";
const ANTHROPIC_VERSION = "2023-06-01";

export function resolveChatProvider(env: ChatProviderEnv): ChatProvider | null {
  const requested = env.AI_PROVIDER?.toLowerCase().trim();

  if (requested === "openrouter") return "openrouter";
  if (requested === "anthropic" || requested === "claude") return "anthropic";
  if (requested) return null;

  if (env.ANTHROPIC_API_KEY && !env.OPENROUTER_API_KEY) return "anthropic";
  return "openrouter";
}

export function getMissingProviderKeyMessage(
  provider: ChatProvider,
  env: ChatProviderEnv
): string | null {
  if (provider === "anthropic" && !env.ANTHROPIC_API_KEY) {
    return "Chat is not configured. Missing Anthropic API key.";
  }

  if (provider === "openrouter" && !env.OPENROUTER_API_KEY) {
    return "Chat is not configured. Missing OpenRouter API key.";
  }

  return null;
}

export function buildProviderRequest(
  provider: ChatProvider,
  env: ChatProviderEnv,
  systemPrompt: string,
  messages: ChatMessage[]
): { url: string; init: RequestInit } {
  if (provider === "anthropic") {
    return {
      url: "https://api.anthropic.com/v1/messages",
      init: {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY ?? "",
          "anthropic-version": ANTHROPIC_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.ANTHROPIC_MODEL || DEFAULT_ANTHROPIC_MODEL,
          max_tokens: 1024,
          stream: true,
          system: systemPrompt,
          messages,
        }),
      },
    };
  }

  return {
    url: "https://openrouter.ai/api/v1/chat/completions",
    init: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY ?? ""}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.APP_URL || "https://accel.io.vn/waifu",
        "X-Title": "UIT Waifu",
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
        stream: true,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    },
  };
}

export function extractProviderDelta(
  provider: ChatProvider,
  payload: unknown
): string {
  if (!payload || typeof payload !== "object") return "";

  const data = payload as Record<string, unknown>;

  if (provider === "anthropic") {
    const delta = data.delta;
    if (!delta || typeof delta !== "object") return "";

    const typedDelta = delta as Record<string, unknown>;
    if (
      data.type === "content_block_delta" &&
      typedDelta.type === "text_delta" &&
      typeof typedDelta.text === "string"
    ) {
      return typedDelta.text;
    }

    return "";
  }

  const choices = data.choices;
  if (!Array.isArray(choices)) return "";

  const first = choices[0];
  if (!first || typeof first !== "object") return "";

  const delta = (first as Record<string, unknown>).delta;
  if (!delta || typeof delta !== "object") return "";

  const content = (delta as Record<string, unknown>).content;
  return typeof content === "string" ? content : "";
}
