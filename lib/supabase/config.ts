export interface SupabasePublicConfig {
  url: string;
  anonKey: string;
}

type PublicEnv = Record<string, string | undefined>;

export function getSupabasePublicConfig(
  env: PublicEnv = {}
): SupabasePublicConfig | null {
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}
