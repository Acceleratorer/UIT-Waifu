import Link from "next/link";
import { ChatWindow } from "@/components/chat/chat-window";

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          UIT Waifu
        </Link>
        <span className="rounded-full border border-pink-300/40 bg-pink-500/10 px-3 py-0.5 text-xs font-medium text-pink-500">
          Chat
        </span>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
}
