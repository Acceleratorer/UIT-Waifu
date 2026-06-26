"use client";

import { useRef, type KeyboardEvent } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder="Message UIT Waifu..."
        className="max-h-40 min-h-[92px] pb-14"
      />
      <div className="absolute bottom-2 right-2">
        {isStreaming ? (
          <Button
            onClick={onStop}
            variant="secondary"
            size="sm"
          >
            <Square className="h-3.5 w-3.5" aria-hidden="true" />
            Stop
          </Button>
        ) : (
          <Button
            onClick={onSend}
            disabled={!value.trim()}
            size="sm"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Send
          </Button>
        )}
      </div>
    </div>
  );
}
