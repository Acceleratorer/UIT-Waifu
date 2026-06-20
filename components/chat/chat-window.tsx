"use client";

import { useEffect, useRef } from "react";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { ModeSelector } from "./mode-selector";
import { useChat } from "@/features/chat/hooks/use-chat";
import { MODES } from "@/data/modes";

export function ChatWindow() {
  const { messages, input, setInput, isStreaming, error, mode, setMode, send, stop, clear } =
    useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto h-full max-w-3xl">
          <MessageList messages={messages} isStreaming={isStreaming} />
        </div>
      </div>

      <div className="border-t border-foreground/10 px-4 py-4">
        <div className="mx-auto max-w-3xl">
          {error && (
            <p className="mb-2 text-sm text-red-500" role="alert">
              {error}
            </p>
          )}
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <ModeSelector value={mode} onChange={setMode} disabled={isStreaming} />
            <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
              <span className="hidden min-w-0 truncate text-xs text-foreground/40 sm:block">
                {MODES.find((m) => m.id === mode)?.description}
              </span>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="shrink-0 rounded-lg border border-foreground/15 px-3 py-1.5 text-xs font-medium text-foreground/70 transition hover:bg-foreground/5"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <MessageInput
            value={input}
            onChange={setInput}
            onSend={send}
            onStop={stop}
            isStreaming={isStreaming}
          />
          <p className="mt-2 text-center text-xs text-foreground/40">
            UIT Waifu can make mistakes. Verify important academic info with
            official sources.
          </p>
        </div>
      </div>
    </div>
  );
}
