/// <reference types="@cloudflare/workers-types" />
import { composeSystemPrompt } from "../../lib/prompts/compose";
import {
  chatRequestSchema,
  formatZodIssues,
} from "../../lib/validators/chat";

interface Env {
  OPENROUTER_API_KEY: string;
  OPENROUTER_MODEL?: string;
  APP_URL?: string;
}

const DEFAULT_MODEL = "google/gemini-2.0-flash-001";

function jsonErrorResponse(
  status: number,
  code: string,
  message: string,
  details: unknown[] = []
): Response {
  return new Response(JSON.stringify({ error: { code, message, details } }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.OPENROUTER_API_KEY) {
    return jsonErrorResponse(
      500,
      "internal_error",
      "Chat is not configured. Missing API key."
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonErrorResponse(400, "validation_error", "Invalid JSON body.");
  }

  const parsedRequest = chatRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return jsonErrorResponse(
      400,
      "validation_error",
      "Invalid chat request.",
      formatZodIssues(parsedRequest.error)
    );
  }

  const { messages, mode } = parsedRequest.data;

  let upstream: Response;
  try {
    upstream = await fetch(
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
  } catch {
    return jsonErrorResponse(
      502,
      "internal_error",
      "Could not reach the chat provider."
    );
  }

  if (!upstream.ok || !upstream.body) {
    return jsonErrorResponse(
      502,
      "internal_error",
      `Chat provider returned an error (${upstream.status}).`
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
