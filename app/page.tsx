import Link from "next/link";
import Image from "next/image";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function HomePage() {
  return (
    <main className="stage-surface min-h-screen overflow-hidden px-4 py-4">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="relative flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-white/45 bg-zinc-950 text-white shadow-2xl shadow-pink-950/10 dark:border-white/10">
          <div className="stage-grid absolute inset-0 opacity-20" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-pink-400/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-teal-400/20 to-transparent" />

          <div className="relative z-10 flex items-center justify-between p-4">
            <span className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold backdrop-blur-md">
              UIT Waifu
            </span>
            <span className="rounded-xl border border-pink-200/20 bg-pink-200/10 px-3 py-2 text-xs font-medium text-pink-100 backdrop-blur-md">
              Phase 2
            </span>
          </div>

          <div className="relative min-h-0 flex-1">
            <Image
              src={`${BASE_PATH}/icons/logo-stage.png`}
              alt="UIT Waifu avatar"
              width={1320}
              height={1577}
              unoptimized
              priority
              className="avatar-float absolute inset-x-0 bottom-6 mx-auto h-[82%] max-h-[680px] w-auto max-w-[86%] object-contain drop-shadow-[0_28px_44px_rgba(0,0,0,0.45)]"
            />
          </div>
        </section>

        <section className="flex flex-col justify-between rounded-2xl border border-white/45 bg-white/60 p-5 shadow-2xl shadow-pink-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
          <div>
            <p className="mb-3 text-sm font-semibold text-pink-600 dark:text-pink-200">
              In development
            </p>
            <h1 className="text-4xl font-bold sm:text-5xl">UIT Waifu</h1>
            <p className="mt-5 text-base leading-7 text-foreground/70">
              A web-first AI companion for UIT students. Study, debug code,
              revise exams, and plan projects through a character-first chat
              interface.
            </p>
            <p className="mt-5 font-mono text-sm text-foreground/50">
              Useful first. Cute second. Scalable later.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <Link
              href="/chat"
              className="rounded-xl bg-pink-500 px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-pink-600 active:scale-[0.99]"
            >
              Open stage
            </Link>
            <a
              href="https://github.com/Acceleratorer/UIT-Waifu"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-foreground/15 bg-white/35 px-5 py-3 text-center font-semibold transition hover:bg-white/55 dark:bg-white/10 dark:hover:bg-white/15"
            >
              View on GitHub
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
