import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SupabasePublicConfig } from "./config";

let browserClient: SupabaseClient | null = null;
let browserClientCacheKey: string | null = null;

export function getSupabaseBrowserClient(
  config: SupabasePublicConfig | null
): SupabaseClient | null {
  if (!config) return null;

  const cacheKey = `${config.url}:${config.anonKey}`;
  if (!browserClient || browserClientCacheKey !== cacheKey) {
    browserClient = createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });
    browserClientCacheKey = cacheKey;
  }

  return browserClient;
}
