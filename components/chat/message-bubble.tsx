import { MarkdownMessage } from "./markdown-message";
import type { ChatMessage } from "@/features/chat/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={isUser ? "flex justify-end pl-10" : "flex justify-start pr-10"}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-xl bg-zinc-100/85 px-3 py-3 text-foreground shadow-sm backdrop-blur-md dark:bg-zinc-800/85"
            : "max-w-[85%] rounded-xl bg-pink-50/85 px-3 py-3 text-pink-950 shadow-sm shadow-pink-200/40 backdrop-blur-md dark:bg-pink-950/75 dark:text-pink-50 dark:shadow-none"
        }
      >
        <p className="mb-1 text-xs font-medium text-foreground/45">
          {isUser ? "You" : "UIT Waifu"}
        </p>
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <MarkdownMessage content={message.content} />
        )}
      </div>
    </div>
  );
}
