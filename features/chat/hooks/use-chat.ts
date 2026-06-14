"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatMessage } from "../types";

const CHAT_ENDPOINT =
  process.env.NEXT_PUBLIC_CHAT_ENDPOINT || "/api/chat";

interface UseChatResult {
  messages: ChatMessage[];
  input: string;
  setInput: (value: string) => void;
  isStreaming: boolean;
  error: string | null;
  send: () => void;
  stop: () => void;
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const outgoing: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(outgoing);
    setInput("");
    setError(null);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    // Placeholder assistant message we stream tokens into.
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    (async () => {
      try {
        const res = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: outgoing }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const detail = await res.text().catch(() => "");
          throw new Error(detail || `Request failed (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            const line = event.trim();
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta: string = parsed.delta ?? "";
              if (delta) {
                setMessages((prev) => {
                  const next = [...prev];
                  const last = next[next.length - 1];
                  if (last && last.role === "assistant") {
                    next[next.length - 1] = {
                      ...last,
                      content: last.content + delta,
                    };
                  }
                  return next;
                });
              }
            } catch {
              // Ignore malformed keep-alive lines.
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message || "Something went wrong.");
        // Drop the empty assistant placeholder on failure.
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === "assistant" && last.content === "") {
            return prev.slice(0, -1);
          }
          return prev;
        });
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    })();
  }, [input, isStreaming, messages]);

  return { messages, input, setInput, isStreaming, error, send, stop };
}
