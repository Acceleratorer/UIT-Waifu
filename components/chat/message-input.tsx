"use client";

import { useRef, type KeyboardEvent } from "react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  onStop,
  isStreaming,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-pink-200/45 bg-pink-50/65 shadow-sm backdrop-blur-md focus-within:border-pink-400 dark:border-white/10 dark:bg-pink-950/25">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder="Message UIT Waifu..."
        className="max-h-40 min-h-[92px] w-full resize-none bg-transparent px-3 py-3 pb-14 text-sm outline-none placeholder:text-foreground/40"
      />
      <div className="absolute bottom-2 right-2">
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="rounded-md border border-foreground/15 bg-white/60 px-4 py-2 text-sm font-medium transition hover:bg-white/80 active:scale-95 dark:bg-white/10 dark:hover:bg-white/15"
          >
            Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim()}
            className="rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}
