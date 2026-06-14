import { MarkdownMessage } from "./markdown-message";
import type { ChatMessage } from "@/features/chat/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl rounded-br-sm bg-pink-500 px-4 py-2.5 text-white"
            : "max-w-[85%] rounded-2xl rounded-bl-sm bg-foreground/5 px-4 py-2.5"
        }
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <MarkdownMessage content={message.content} />
        )}
      </div>
    </div>
  );
}
