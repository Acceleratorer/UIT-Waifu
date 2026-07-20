import Link from "next/link";
import { DocumentUploadPanel } from "@/components/documents/document-upload-panel";

export default function DocumentsPage() {
  return (
    <main className="stage-surface min-h-screen px-4 py-4">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col p-1 md:p-3">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/"
            className="rounded-xl border border-foreground/10 bg-white/40 px-3 py-2 text-sm font-semibold transition hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/15"
          >
            UIT Waifu
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/chat"
              className="rounded-xl border border-foreground/10 bg-white/40 px-3 py-2 text-sm font-semibold transition hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/15"
            >
              Chat
            </Link>
            <Link
              href="/settings"
              className="rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-600"
            >
              Settings
            </Link>
          </nav>
        </header>

        <DocumentUploadPanel />
      </div>
    </main>
  );
}
