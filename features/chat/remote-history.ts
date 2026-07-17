import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_MODE, isModeId, type ModeId } from "@/data/modes";
import type { ChatMessage } from "./types";

const MAX_CONVERSATION_TITLE_CHARS = 64;
const MAX_REMOTE_CONVERSATIONS = 20;

export interface RemoteConversation {
  id: string;
  title: string;
  mode: ModeId;
  updatedAt: string;
}

export function createConversationTitle(firstMessage: string): string {
  const normalized = firstMessage.replace(/\s+/g, " ").trim();
  if (!normalized) return "New conversation";
  if (normalized.length <= MAX_CONVERSATION_TITLE_CHARS) return normalized;
  return `${normalized.slice(0, MAX_CONVERSATION_TITLE_CHARS - 3)}...`;
}

export function buildMessageRows(
  conversationId: string,
  messages: ChatMessage[]
) {
  return messages.map((message) => ({
    conversation_id: conversationId,
    role: message.role,
    content: message.content,
  }));
}

export function buildConversationRenamePatch(
  title: string,
  updatedAt = new Date().toISOString()
) {
  return {
    title: createConversationTitle(title),
    updated_at: updatedAt,
  };
}

export function normalizeRemoteConversationRow(
  value: unknown
): RemoteConversation | null {
  if (!value || typeof value !== "object") return null;

  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string") return null;

  const title =
    typeof row.title === "string" && row.title.trim()
      ? row.title.trim()
      : "New conversation";
  const updatedAt =
    typeof row.updated_at === "string"
      ? row.updated_at
      : typeof row.created_at === "string"
        ? row.created_at
        : "";

  return {
    id: row.id,
    title: createConversationTitle(title),
    mode: isModeId(row.mode) ? row.mode : DEFAULT_MODE,
    updatedAt,
  };
}

export function normalizeRemoteMessageRow(value: unknown): ChatMessage | null {
  if (!value || typeof value !== "object") return null;

  const row = value as Record<string, unknown>;
  const role = row.role;
  const content = row.content;
  if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
    return null;
  }

  return { role, content };
}

export async function listRemoteConversations(
  supabase: SupabaseClient,
  userId: string
): Promise<RemoteConversation[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("id,title,mode,created_at,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(MAX_REMOTE_CONVERSATIONS);

  if (error) throw error;

  return (data ?? [])
    .map(normalizeRemoteConversationRow)
    .filter((conversation): conversation is RemoteConversation => Boolean(conversation));
}

export async function loadRemoteMessages(
  supabase: SupabaseClient,
  conversationId: string
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("role,content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? [])
    .map(normalizeRemoteMessageRow)
    .filter((message): message is ChatMessage => Boolean(message));
}

export async function deleteRemoteConversation(
  supabase: SupabaseClient,
  conversationId: string
): Promise<void> {
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);

  if (error) throw error;
}

export async function renameRemoteConversation(
  supabase: SupabaseClient,
  conversationId: string,
  title: string
): Promise<RemoteConversation | null> {
  const { data, error } = await supabase
    .from("conversations")
    .update(buildConversationRenamePatch(title))
    .eq("id", conversationId)
    .select("id,title,mode,created_at,updated_at")
    .single();

  if (error) throw error;

  return normalizeRemoteConversationRow(data);
}

export async function ensureRemoteConversation({
  supabase,
  existingConversationId,
  userId,
  mode,
  firstMessage,
}: {
  supabase: SupabaseClient;
  existingConversationId: string | null;
  userId: string;
  mode: ModeId;
  firstMessage: string;
}): Promise<string | null> {
  if (existingConversationId) return existingConversationId;

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: userId,
      mode,
      title: createConversationTitle(firstMessage),
    })
    .select("id")
    .single();

  if (error) throw error;

  const id = data?.id;
  return typeof id === "string" ? id : null;
}

export async function saveRemoteMessages(
  supabase: SupabaseClient,
  conversationId: string,
  messages: ChatMessage[]
) {
  if (messages.length === 0) return;

  const { error } = await supabase
    .from("messages")
    .insert(buildMessageRows(conversationId, messages));

  if (error) throw error;

  const { error: touchError } = await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  if (touchError) throw touchError;
}
