import Link from "next/link";
import { SettingsPanel } from "@/components/settings/settings-panel";

export default function SettingsPage() {
  return (
    <main className="stage-surface min-h-screen px-4 py-4">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col rounded-2xl border border-white/45 bg-white/60 p-4 shadow-2xl shadow-pink-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-black/25 md:p-6">
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="rounded-xl border border-foreground/10 bg-white/40 px-3 py-2 text-sm font-semibold transition hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/15"
          >
            UIT Waifu
          </Link>
          <Link
            href="/chat"
            className="rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-600"
          >
            Open stage
          </Link>
        </header>

        <SettingsPanel />
      </div>
    </main>
  );
}
