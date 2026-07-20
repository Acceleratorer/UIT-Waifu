import Link from "next/link";
import { ChatWindow } from "@/components/chat/chat-window";

export default function ChatPage() {
  return (
    <div className="stage-surface flex h-screen flex-col overflow-hidden">
      <header className="z-10 flex items-center justify-between px-3 py-2 md:px-4 md:py-3">
        <Link
          href="/"
          className="rounded-xl border border-white/40 bg-white/60 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur-md transition hover:bg-white/75 dark:border-white/10 dark:bg-black/25 dark:hover:bg-black/35"
        >
          UIT Waifu
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/documents"
            className="rounded-xl border border-white/40 bg-white/55 px-3 py-2 text-xs font-medium text-foreground/70 shadow-sm backdrop-blur-md transition hover:bg-white/70 dark:border-white/10 dark:bg-black/25 dark:hover:bg-black/35"
          >
            Documents
          </Link>
          <Link
            href="/settings"
            className="rounded-xl border border-white/40 bg-white/55 px-3 py-2 text-xs font-medium text-foreground/70 shadow-sm backdrop-blur-md transition hover:bg-white/70 dark:border-white/10 dark:bg-black/25 dark:hover:bg-black/35"
          >
            Settings
          </Link>
          <span className="rounded-xl border border-pink-300/45 bg-pink-500/15 px-3 py-2 text-xs font-semibold text-pink-600 shadow-sm backdrop-blur-md dark:text-pink-200">
            Chat
          </span>
        </nav>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3 md:px-4 md:pb-4">
        <ChatWindow />
      </div>
    </div>
  );
}
