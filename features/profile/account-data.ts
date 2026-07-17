import type { SupabaseClient } from "@supabase/supabase-js";

export interface AccountDataDeleteTarget {
  table: "profiles" | "conversations";
  column: "user_id";
  value: string;
}

export function buildAccountDataDeleteTargets(
  userId: string
): AccountDataDeleteTarget[] {
  return [
    { table: "profiles", column: "user_id", value: userId },
    { table: "conversations", column: "user_id", value: userId },
  ];
}

export async function deleteAccountData(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  for (const target of buildAccountDataDeleteTargets(userId)) {
    const { error } = await supabase
      .from(target.table)
      .delete()
      .eq(target.column, target.value);

    if (error) throw error;
  }
}
