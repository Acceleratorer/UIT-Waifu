import type { SupabaseClient } from "@supabase/supabase-js";
import type { ModeId } from "@/data/modes";
import type { ChatMessage } from "./types";

const MAX_CONVERSATION_TITLE_CHARS = 64;

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
}
