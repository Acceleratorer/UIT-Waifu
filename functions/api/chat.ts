/// <reference types="@cloudflare/workers-types" />
import { composeSystemPrompt } from "../../lib/prompts/compose";
import {
  chatRequestSchema,
  formatZodIssues,
} from "../../lib/validators/chat";
import {
  buildProviderRequest,
  extractProviderDelta,
  getMissingProviderKeyMessage,
  resolveChatProvider,
} from "../../lib/ai/providers";
import { serializeChatStreamEvent } from "../../lib/ai/stream-events";
import {
  isJsonContentType,
  isSameOriginRequest,
  MAX_CHAT_REQUEST_BYTES,
} from "../../lib/http/request-security";

interface Env {
  AI_PROVIDER?: string;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  ANTHROPIC_AUTH_TOKEN?: string;
  ANTHROPIC_API_KEY?: string;
  ANTHROPIC_BASE_URL?: string;
  ANTHROPIC_MODEL?: string;
  ANTHROPIC_DEFAULT_OPUS_MODEL?: string;
  ANTHROPIC_DEFAULT_SONNET_MODEL?: string;
  ANTHROPIC_DEFAULT_HAIKU_MODEL?: string;
  APP_URL?: string;
}

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

  if (!isSameOriginRequest(request)) {
    return jsonErrorResponse(
      403,
      "forbidden",
      "Cross-origin chat requests are not allowed."
    );
  }

  if (!isJsonContentType(request.headers.get("content-type"))) {
    return jsonErrorResponse(
      415,
      "unsupported_media",
      "Chat requests must use application/json."
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_CHAT_REQUEST_BYTES) {
    return jsonErrorResponse(
      413,
      "payload_too_large",
      "Chat request is too large."
    );
  }

  const provider = resolveChatProvider(env);
  if (!provider) {
    return jsonErrorResponse(
      500,
      "internal_error",
      "Chat is not configured. Unsupported AI provider."
    );
  }

  const missingKeyMessage = getMissingProviderKeyMessage(provider, env);
  if (missingKeyMessage) {
    return jsonErrorResponse(500, "internal_error", missingKeyMessage);
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
  const upstreamRequest = buildProviderRequest(
    provider,
    env,
    composeSystemPrompt(mode),
    messages
  );

  let upstream: Response;
  try {
    upstream = await fetch(upstreamRequest.url, upstreamRequest.init);
  } catch {
    return jsonErrorResponse(
      502,
      "internal_error",
      "Could not reach the chat provider."
    );
  }

  if (!upstream.ok || !upstream.body) {
    const message =
      upstream.status === 401 || upstream.status === 403
        ? "Chat is temporarily unavailable. Provider authentication failed."
        : `Chat provider returned an error (${upstream.status}).`;

    return jsonErrorResponse(
      502,
      "internal_error",
      message
    );
  }

  // Translate provider-specific SSE into our normalized stream events.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream({
    async pull(controller) {
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          controller.enqueue(
            encoder.encode(serializeChatStreamEvent({ type: "done" }))
          );
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
            const delta = extractProviderDelta(provider, parsed);
            if (delta) {
              controller.enqueue(
                encoder.encode(
                  serializeChatStreamEvent({ type: "delta", delta })
                )
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
