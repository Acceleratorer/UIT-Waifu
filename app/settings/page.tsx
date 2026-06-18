import Link from "next/link";
import { SettingsPanel } from "@/components/settings/settings-panel";

export default function SettingsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-8">
      <header className="mb-10 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          UIT Waifu
        </Link>
        <Link
          href="/chat"
          className="rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
        >
          Open chat
        </Link>
      </header>

      <SettingsPanel />
    </main>
  );
}
