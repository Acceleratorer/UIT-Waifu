import { MessageBubble } from "./message-bubble";
import { MODES, type ModeId } from "@/data/modes";
import type { ChatMessage } from "@/features/chat/types";

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  mode: ModeId;
  onStarterSelect: (prompt: string) => void;
}

export function MessageList({
  messages,
  isStreaming,
  mode,
  onStarterSelect,
}: MessageListProps) {
  if (messages.length === 0) {
    const activeMode = MODES.find((m) => m.id === mode) ?? MODES[0];

    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-foreground/55">
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            {activeMode.label} mode
          </p>
          <p className="max-w-sm text-sm">
            {activeMode.description} Vietnamese and English both work.
          </p>
        </div>
        <div className="grid w-full max-w-xl gap-2 sm:grid-cols-2">
          {activeMode.starters.map((starter) => (
            <button
              key={starter.label}
              type="button"
              onClick={() => onStarterSelect(starter.prompt)}
              className="min-h-12 rounded-xl border border-pink-200/40 bg-white/55 px-3 py-2 text-left text-sm font-medium text-foreground shadow-sm backdrop-blur-md transition hover:border-pink-300 hover:bg-pink-500/10 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:border-white/10 dark:bg-white/10"
            >
              {starter.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const last = messages[messages.length - 1];
  const showTyping =
    isStreaming && last?.role === "assistant" && last.content === "";

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, i) => (
        <MessageBubble key={i} message={message} />
      ))}
      {showTyping && (
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-sm bg-foreground/5 px-4 py-3">
            <span className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
