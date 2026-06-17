/// <reference types="@cloudflare/workers-types" />
import { composeSystemPrompt } from "../../lib/prompts/compose";
import { DEFAULT_MODE, isModeId } from "../../data/modes";

interface Env {
  OPENROUTER_API_KEY: string;
  OPENROUTER_MODEL?: string;
  APP_URL?: string;
}

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGES = 50;
const MAX_CONTENT_CHARS = 12_000;
const DEFAULT_MODEL = "google/gemini-2.0-flash-001";

function errorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isValidMessages(value: unknown): value is IncomingMessage[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  if (value.length > MAX_MESSAGES) return false;
  return value.every(
    (m) =>
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length > 0 &&
      m.content.length <= MAX_CONTENT_CHARS
  );
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.OPENROUTER_API_KEY) {
    return errorResponse(500, "Chat is not configured. Missing API key.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "Invalid JSON body.");
  }

  const messages = (body as { messages?: unknown })?.messages;
  if (!isValidMessages(messages)) {
    return errorResponse(400, "Invalid messages.");
  }

  const rawMode = (body as { mode?: unknown })?.mode;
  const mode = isModeId(rawMode) ? rawMode : DEFAULT_MODE;

  const upstream = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.APP_URL || "https://accel.io.vn/waifu",
        "X-Title": "UIT Waifu",
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL || DEFAULT_MODEL,
        stream: true,
        messages: [
          { role: "system", content: composeSystemPrompt(mode) },
          ...messages,
        ],
      }),
    }
  );

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return errorResponse(
      502,
      `Upstream error (${upstream.status}). ${detail.slice(0, 200)}`
    );
  }

  // Translate OpenRouter's OpenAI-style SSE into our {delta} events.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream({
    async pull(controller) {
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta: string = parsed.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`)
              );
            }
          } catch {
            // Skip non-JSON keep-alive lines.
          }
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
