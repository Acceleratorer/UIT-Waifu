import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <span className="rounded-full border border-pink-300/40 bg-pink-500/10 px-4 py-1 text-sm font-medium text-pink-500">
        In development
      </span>

      <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
        UIT Waifu
      </h1>

      <p className="max-w-xl text-balance text-lg text-foreground/70">
        A web-first AI companion for University of Information Technology
        students. Chat, study, debug code, and understand documents — with a
        friendly digital companion.
      </p>

      <p className="font-mono text-sm text-foreground/50">
        Useful first. Cute second. Scalable later.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/chat"
          className="rounded-xl bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
        >
          Start chatting
        </Link>
        <a
          href="https://github.com/Acceleratorer/UIT-Waifu"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-foreground/15 px-6 py-3 font-semibold transition hover:bg-foreground/5"
        >
          View on GitHub
        </a>
      </div>
    </main>
  );
}
