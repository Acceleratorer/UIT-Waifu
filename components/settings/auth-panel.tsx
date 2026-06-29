"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function getRedirectTo() {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}${BASE_PATH}/settings`;
}

export function AuthPanel() {
  const supabase = useMemo(
    () =>
      getSupabaseBrowserClient(
        getSupabasePublicConfig({
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY:
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        })
      ),
    []
  );
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"loading" | "ready">(
    supabase ? "loading" : "ready"
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    let isMounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      setSession(data.session);
      setError(error?.message ?? null);
      setStatus("ready");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setStatus("ready");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Email is required.");
      setMessage(null);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: { emailRedirectTo: getRedirectTo() },
    });

    setIsSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Magic link sent. Check your email.");
  }

  async function handleSignOut() {
    if (!supabase) return;

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signOut({ scope: "local" });

    setIsSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }

    setSession(null);
    setMessage("Signed out on this device.");
  }

  return (
    <section className="border-t border-foreground/10 pt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Account</h2>
          <p className="mt-1 text-sm text-foreground/55">
            {supabase
              ? session
                ? `Signed in as ${session.user.email ?? "current user"}`
                : "Sign in to save conversations later."
              : "Supabase is not configured."}
          </p>
        </div>
        {status === "loading" && (
          <span className="rounded-full border border-foreground/10 px-3 py-1 text-xs text-foreground/55">
            Loading
          </span>
        )}
      </div>

      {supabase && status === "ready" && !session && (
        <form onSubmit={handleSignIn} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@example.com"
              autoComplete="email"
              className="h-10 w-full rounded-xl border border-pink-200/45 bg-white/65 px-3 py-2 text-sm outline-none shadow-sm backdrop-blur-md transition placeholder:text-foreground/35 focus:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-400 dark:border-white/10 dark:bg-white/10"
            />
          </label>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send magic link"}
          </Button>
        </form>
      )}

      {supabase && status === "ready" && session && (
        <div className="mt-4">
          <Button onClick={handleSignOut} variant="secondary" disabled={isSubmitting}>
            {isSubmitting ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      )}

      {(message || error) && (
        <p
          className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
            error
              ? "border-red-400/20 bg-red-500/10 text-red-600 dark:text-red-300"
              : "border-teal-400/20 bg-teal-500/10 text-teal-700 dark:text-teal-200"
          }`}
          role={error ? "alert" : "status"}
        >
          {error || message}
        </p>
      )}
    </section>
  );
}
