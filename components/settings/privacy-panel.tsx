"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { deleteAccountData } from "@/features/profile/account-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

type PrivacyStatus = "loading" | "signed-out" | "ready" | "deleting" | "error";

export function PrivacyPanel() {
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
  const [status, setStatus] = useState<PrivacyStatus>(
    supabase ? "loading" : "signed-out"
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    let isMounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        setError(error.message);
        setStatus("error");
        return;
      }
      setSession(data.session);
      setStatus(data.session ? "ready" : "signed-out");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setStatus(nextSession ? "ready" : "signed-out");
      setMessage(null);
      setError(null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (!supabase) return null;

  async function handleDeleteData() {
    if (!supabase || !session || typeof window === "undefined") return;

    const confirmation = window.prompt(
      "Type DELETE to remove your saved profile and conversations."
    );
    if (confirmation !== "DELETE") return;

    setStatus("deleting");
    setMessage(null);
    setError(null);

    try {
      await deleteAccountData(supabase, session.user.id);
      setStatus("ready");
      setMessage("Saved profile and conversations were deleted.");
    } catch (err) {
      setError((err as Error).message || "Could not delete saved data.");
      setStatus("error");
    }
  }

  const isBusy = status === "loading" || status === "deleting";

  return (
    <section className="border-t border-foreground/10 pt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Privacy</h2>
          <p className="mt-1 text-sm text-foreground/55">
            {status === "signed-out"
              ? "Sign in to manage saved account data."
              : "Delete saved profile data and conversation history from Supabase."}
          </p>
        </div>
        {isBusy && (
          <span className="rounded-full border border-foreground/10 px-3 py-1 text-xs text-foreground/55">
            {status === "deleting" ? "Deleting" : "Loading"}
          </span>
        )}
      </div>

      {status !== "signed-out" && (
        <div className="mt-4">
          <Button
            onClick={handleDeleteData}
            variant="secondary"
            disabled={isBusy || !session}
          >
            Delete saved data
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
