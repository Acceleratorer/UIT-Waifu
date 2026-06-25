"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { ModeSelector } from "./mode-selector";
import { useChat } from "@/features/chat/hooks/use-chat";
import { MODES, type Mode } from "@/data/modes";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function ChatWindow() {
  const { messages, input, setInput, isStreaming, error, mode, setMode, send, stop, clear } =
    useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeMode = MODES.find((m) => m.id === mode) ?? MODES[0];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className="grid h-full min-h-0 grid-rows-[minmax(180px,32vh)_minmax(0,1fr)] gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(420px,500px)] lg:grid-rows-1">
      <StagePanel
        activeMode={activeMode}
        isStreaming={isStreaming}
        messageCount={messages.length}
      />

      <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/45 bg-white/55 shadow-2xl shadow-pink-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-black/25 dark:shadow-black/30">
        <div className="relative h-1 overflow-hidden bg-pink-500/10">
          {isStreaming && (
            <div className="stage-scan h-full w-1/3 bg-pink-500/60" />
          )}
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-4">
          <div className="mx-auto h-full max-w-3xl">
            <MessageList
              messages={messages}
              isStreaming={isStreaming}
              mode={mode}
              onStarterSelect={setInput}
            />
          </div>
        </div>

        <div className="border-t border-white/45 bg-white/45 px-3 py-3 backdrop-blur-md dark:border-white/10 dark:bg-black/20 md:px-4">
        <div className="mx-auto max-w-3xl">
            {error && (
              <p
                className="mb-2 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300"
                role="alert"
              >
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
      </section>
    </div>
  );
}

function StagePanel({
  activeMode,
  isStreaming,
  messageCount,
}: {
  activeMode: Mode;
  isStreaming: boolean;
  messageCount: number;
}) {
  const state = isStreaming ? "Thinking" : messageCount > 0 ? "Listening" : "Ready";

  return (
    <section className="relative min-h-0 overflow-hidden rounded-2xl border border-white/45 bg-zinc-950 text-white shadow-2xl shadow-teal-950/10 dark:border-white/10">
      <div className="stage-grid absolute inset-0 opacity-20" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-pink-400/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-teal-400/20 to-transparent" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 p-3 lg:p-4">
          <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">
            <p className="text-xs uppercase text-white/50">Stage</p>
            <p className="text-sm font-semibold">{state}</p>
          </div>
          <div className="rounded-xl border border-pink-200/20 bg-pink-200/10 px-3 py-2 text-right backdrop-blur-md">
            <p className="text-xs uppercase text-white/50">Mode</p>
            <p className="text-sm font-semibold">{activeMode.label}</p>
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          <Image
            src={`${BASE_PATH}/icons/logo-stage.png`}
            alt="UIT Waifu avatar"
            width={1320}
            height={1577}
            unoptimized
            priority
            className="avatar-float absolute inset-x-0 bottom-2 mx-auto h-[80%] max-h-[620px] w-auto max-w-[82%] object-contain drop-shadow-[0_28px_44px_rgba(0,0,0,0.45)] lg:bottom-10 lg:h-[74%]"
          />
        </div>

        <div className="relative z-10 hidden p-4 md:block">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">UIT Waifu</p>
                <p className="mt-1 max-w-md text-sm text-white/65">
                  {activeMode.description}
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-200/20 bg-teal-200/10 text-sm font-semibold text-teal-100">
                AI
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
