"use client";

import { useEffect, useRef } from "react";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { useChat } from "@/features/chat/hooks/use-chat";

export function ChatWindow() {
  const { messages, input, setInput, isStreaming, error, send, stop } =
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
