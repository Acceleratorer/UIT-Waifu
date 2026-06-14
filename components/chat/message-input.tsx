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
    <div className="flex items-end gap-2 rounded-2xl border border-foreground/15 bg-background p-2 focus-within:border-pink-400">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Message UIT Waifu…"
        className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 outline-none placeholder:text-foreground/40"
      />
      {isStreaming ? (
        <button
          type="button"
          onClick={onStop}
          className="rounded-xl border border-foreground/15 px-4 py-2 font-medium transition hover:bg-foreground/5"
        >
          Stop
        </button>
      ) : (
        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim()}
          className="rounded-xl bg-pink-500 px-4 py-2 font-medium text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send
        </button>
      )}
    </div>
  );
}
