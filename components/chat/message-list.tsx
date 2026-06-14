import { MessageBubble } from "./message-bubble";
import type { ChatMessage } from "@/features/chat/types";

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-foreground/50">
        <p className="text-lg font-medium">Chat with UIT Waifu</p>
        <p className="max-w-sm text-sm">
          Ask about a concept, paste an error, or get help planning your study
          week. Vietnamese and English both work.
        </p>
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
