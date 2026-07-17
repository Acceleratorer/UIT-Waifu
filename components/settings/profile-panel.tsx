"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  EMPTY_PROFILE,
  buildProfileUpsertRow,
  normalizeProfileRow,
  type ProfileFormValues,
} from "@/features/profile/profile";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

type ProfileStatus = "loading" | "signed-out" | "ready" | "saving" | "error";

export function ProfilePanel() {
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
  const [values, setValues] = useState<ProfileFormValues>(EMPTY_PROFILE);
  const [status, setStatus] = useState<ProfileStatus>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    const client = supabase;
    let isMounted = true;

    async function loadProfile(nextSession: Session | null) {
      setSession(nextSession);
      setMessage(null);
      setError(null);

      if (!nextSession) {
        setValues(EMPTY_PROFILE);
        setStatus("signed-out");
        return;
      }

      setStatus("loading");
      const { data, error } = await client
        .from("profiles")
        .select("display_name,major,year")
        .eq("user_id", nextSession.user.id)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        setError(error.message);
        setStatus("error");
        return;
      }

      setValues(normalizeProfileRow(data));
      setStatus("ready");
    }

    client.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        setError(error.message);
        setStatus("error");
        return;
      }
      loadProfile(data.session);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      loadProfile(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (!supabase) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !session) return;

    setStatus("saving");
    setError(null);
    setMessage(null);

    const { data, error } = await supabase
      .from("profiles")
      .upsert(buildProfileUpsertRow(session.user.id, values), {
        onConflict: "user_id",
      })
      .select("display_name,major,year")
      .single();

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    setValues(normalizeProfileRow(data));
    setStatus("ready");
    setMessage("Profile saved.");
  }

  const isBusy = status === "loading" || status === "saving";

  return (
    <section className="border-t border-foreground/10 pt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-foreground/55">
            {status === "signed-out"
              ? "Sign in to save your profile."
              : "Keep basic study context ready for future personalization."}
          </p>
        </div>
        {isBusy && (
          <span className="rounded-full border border-foreground/10 px-3 py-1 text-xs text-foreground/55">
            {status === "saving" ? "Saving" : "Loading"}
          </span>
        )}
      </div>

      {status !== "signed-out" && (
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <label className="block">
            <span className="text-sm font-medium">Display name</span>
            <input
              value={values.displayName}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  displayName: event.target.value,
                }))
              }
              placeholder="How UIT Waifu should call you"
              autoComplete="name"
              disabled={isBusy}
              className="mt-2 h-10 w-full rounded-xl border border-pink-200/45 bg-white/65 px-3 py-2 text-sm outline-none shadow-sm backdrop-blur-md transition placeholder:text-foreground/35 focus:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-400 disabled:opacity-50 dark:border-white/10 dark:bg-white/10"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
            <label className="block">
              <span className="text-sm font-medium">Major</span>
              <input
                value={values.major}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    major: event.target.value,
                  }))
                }
                placeholder="Computer Science"
                disabled={isBusy}
                className="mt-2 h-10 w-full rounded-xl border border-pink-200/45 bg-white/65 px-3 py-2 text-sm outline-none shadow-sm backdrop-blur-md transition placeholder:text-foreground/35 focus:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-400 disabled:opacity-50 dark:border-white/10 dark:bg-white/10"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Year</span>
              <input
                type="number"
                min={1}
                max={8}
                value={values.year}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    year: event.target.value,
                  }))
                }
                placeholder="2"
                disabled={isBusy}
                className="mt-2 h-10 w-full rounded-xl border border-pink-200/45 bg-white/65 px-3 py-2 text-sm outline-none shadow-sm backdrop-blur-md transition placeholder:text-foreground/35 focus:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-400 disabled:opacity-50 dark:border-white/10 dark:bg-white/10"
              />
            </label>
          </div>

          <div>
            <Button type="submit" disabled={isBusy || !session}>
              {status === "saving" ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </form>
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
