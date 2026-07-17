import type { SupabaseClient } from "@supabase/supabase-js";

export interface AccountDataExport {
  exportedAt: string;
  profile: {
    displayName: string | null;
    major: string | null;
    year: number | null;
    createdAt: string | null;
    updatedAt: string | null;
  } | null;
  conversations: Array<{
    id: string;
    title: string | null;
    mode: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    messages: Array<{
      role: string;
      content: string;
      createdAt: string | null;
    }>;
  }>;
}

export interface AccountDataDeleteTarget {
  table: "profiles" | "conversations";
  column: "user_id";
  value: string;
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function buildAccountDataExport({
  exportedAt,
  profile,
  conversations,
  messages,
}: {
  exportedAt: string;
  profile: unknown;
  conversations: unknown[];
  messages: unknown[];
}): AccountDataExport {
  const messageGroups = new Map<string, AccountDataExport["conversations"][number]["messages"]>();

  for (const value of messages) {
    if (!value || typeof value !== "object") continue;

    const row = value as Record<string, unknown>;
    const conversationId = stringOrNull(row.conversation_id);
    const role = stringOrNull(row.role);
    const content = stringOrNull(row.content);
    if (!conversationId || !role || content === null) continue;

    const group = messageGroups.get(conversationId) ?? [];
    group.push({
      role,
      content,
      createdAt: stringOrNull(row.created_at),
    });
    messageGroups.set(conversationId, group);
  }

  const profileRow =
    profile && typeof profile === "object" ? (profile as Record<string, unknown>) : null;

  return {
    exportedAt,
    profile: profileRow
      ? {
          displayName: stringOrNull(profileRow.display_name),
          major: stringOrNull(profileRow.major),
          year: numberOrNull(profileRow.year),
          createdAt: stringOrNull(profileRow.created_at),
          updatedAt: stringOrNull(profileRow.updated_at),
        }
      : null,
    conversations: conversations.flatMap((value) => {
      if (!value || typeof value !== "object") return [];

      const row = value as Record<string, unknown>;
      const id = stringOrNull(row.id);
      if (!id) return [];

      return [
        {
          id,
          title: stringOrNull(row.title),
          mode: stringOrNull(row.mode),
          createdAt: stringOrNull(row.created_at),
          updatedAt: stringOrNull(row.updated_at),
          messages: messageGroups.get(id) ?? [],
        },
      ];
    }),
  };
}

export async function exportAccountData(
  supabase: SupabaseClient,
  userId: string
): Promise<AccountDataExport> {
  const exportedAt = new Date().toISOString();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("display_name,major,year,created_at,updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (profileError) throw profileError;

  const { data: conversations, error: conversationsError } = await supabase
    .from("conversations")
    .select("id,title,mode,created_at,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (conversationsError) throw conversationsError;

  const conversationRows = conversations ?? [];
  const conversationIds = conversationRows
    .map((row) => stringOrNull((row as Record<string, unknown>).id))
    .filter((id): id is string => Boolean(id));

  let messages: unknown[] = [];
  if (conversationIds.length > 0) {
    const { data, error } = await supabase
      .from("messages")
      .select("conversation_id,role,content,created_at")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: true });

    if (error) throw error;
    messages = data ?? [];
  }

  return buildAccountDataExport({
    exportedAt,
    profile,
    conversations: conversationRows,
    messages,
  });
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
