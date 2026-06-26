import { MessageBubble } from "./message-bubble";
import { Button } from "@/components/ui/button";
import { getModeById, type ModeId } from "@/data/modes";
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
    const activeMode = getModeById(mode);

    return (
      <div className="flex min-h-full flex-col items-center justify-start gap-4 py-4 text-center text-foreground/55 sm:justify-center">
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
            <Button
              key={starter.label}
              onClick={() => onStarterSelect(starter.prompt)}
              variant="outline"
              className="min-h-12 justify-start rounded-xl px-3 py-2 text-left"
            >
              {starter.label}
            </Button>
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
