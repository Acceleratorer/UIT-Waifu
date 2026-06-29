"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChatMessage } from "../types";
import { DEFAULT_MODE, type ModeId } from "@/data/modes";
import { parseChatStreamData } from "@/lib/ai/stream-events";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import {
  clearSessionMessages,
  readDefaultMode,
  readSessionMessages,
  writeDefaultMode,
  writeSessionMessages,
} from "../preferences";
import { ensureRemoteConversation, saveRemoteMessages } from "../remote-history";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const CHAT_ENDPOINT =
  process.env.NEXT_PUBLIC_CHAT_ENDPOINT || `${BASE_PATH}/api/chat`;
const SUPABASE_CONFIG = getSupabasePublicConfig({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

async function readErrorMessage(res: Response): Promise<string> {
  const fallback = `Request failed (${res.status})`;
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await res.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
    return body?.error?.message || fallback;
  }

  const detail = await res.text().catch(() => "");
  return detail || fallback;
}

interface UseChatResult {
  messages: ChatMessage[];
  input: string;
  setInput: (value: string) => void;
  isStreaming: boolean;
  error: string | null;
  mode: ModeId;
  setMode: (mode: ModeId) => void;
  send: () => void;
  stop: () => void;
  clear: () => void;
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setModeState] = useState<ModeId>(DEFAULT_MODE);
  const [hasLoadedSession, setHasLoadedSession] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const supabaseRef = useRef<SupabaseClient | null>(null);
  const userIdRef = useRef<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    setModeState(readDefaultMode());
    setMessages(readSessionMessages());
    setHasLoadedSession(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedSession) return;
    writeSessionMessages(messages);
  }, [hasLoadedSession, messages]);

  useEffect(() => {
    if (!SUPABASE_CONFIG) return;

    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    import("@/lib/supabase/client").then(({ getSupabaseBrowserClient }) => {
      if (!isMounted) return;

      const supabase = getSupabaseBrowserClient(SUPABASE_CONFIG);
      supabaseRef.current = supabase;
      if (!supabase) return;

      supabase.auth.getSession().then(({ data }) => {
        if (!isMounted) return;
        userIdRef.current = data.session?.user.id ?? null;
        conversationIdRef.current = null;
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        userIdRef.current = session?.user.id ?? null;
        conversationIdRef.current = null;
      });

      unsubscribe = () => subscription.unsubscribe();
    });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const setMode = useCallback((nextMode: ModeId) => {
    setModeState(nextMode);
    writeDefaultMode(nextMode);
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    conversationIdRef.current = null;
    setMessages([]);
    setError(null);
    setIsStreaming(false);
    clearSessionMessages();
  }, []);

  const saveCompletedTurn = useCallback(
    async (userContent: string, assistantContent: string, activeMode: ModeId) => {
      const supabase = supabaseRef.current;
      const userId = userIdRef.current;

      if (!supabase || !userId || assistantContent.trim().length === 0) {
        return;
      }

      try {
        const conversationId = await ensureRemoteConversation({
          supabase,
          existingConversationId: conversationIdRef.current,
          userId,
          mode: activeMode,
          firstMessage: userContent,
        });

        if (!conversationId) return;
        conversationIdRef.current = conversationId;

        await saveRemoteMessages(supabase, conversationId, [
          { role: "user", content: userContent },
          { role: "assistant", content: assistantContent },
        ]);
      } catch (err) {
        console.warn("Could not save chat history.", err);
      }
    },
    []
  );

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
          body: JSON.stringify({ messages: outgoing, mode }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(await readErrorMessage(res));
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantContent = "";

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
            const parsed = parseChatStreamData(data);
            if (!parsed) continue;

            if (parsed.type === "delta" && parsed.delta) {
              assistantContent += parsed.delta;
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last && last.role === "assistant") {
                  next[next.length - 1] = {
                    ...last,
                    content: last.content + parsed.delta,
                  };
                }
                return next;
              });
            }

            if (parsed.type === "error") {
              throw new Error(parsed.message);
            }
          }
        }

        await saveCompletedTurn(text, assistantContent, mode);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.role === "assistant" && last.content === "") {
              return prev.slice(0, -1);
            }
            return prev;
          });
          return;
        }
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
  }, [input, isStreaming, messages, mode, saveCompletedTurn]);

  return {
    messages,
    input,
    setInput,
    isStreaming,
    error,
    mode,
    setMode,
    send,
    stop,
    clear,
  };
}
