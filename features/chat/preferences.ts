import { DEFAULT_MODE, isModeId, type ModeId } from "@/data/modes";
import type { ChatMessage } from "./types";

const DEFAULT_MODE_KEY = "uit-waifu.default-mode";
const SESSION_MESSAGES_KEY = "uit-waifu.session-messages";
const MAX_STORED_MESSAGES = 50;
const MAX_STORED_CONTENT_CHARS = 12_000;

export function readDefaultMode(): ModeId {
  if (typeof window === "undefined") return DEFAULT_MODE;

  try {
    const value = window.localStorage.getItem(DEFAULT_MODE_KEY);
    return isModeId(value) ? value : DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

export function writeDefaultMode(mode: ModeId) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(DEFAULT_MODE_KEY, mode);
  } catch {
    // Storage can fail in private mode or when quota is exhausted.
  }
}

export function normalizeStoredMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];

  const messages: ChatMessage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;

    const message = item as Record<string, unknown>;
    const role = message.role;
    const content = message.content;

    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;
    if (content.trim().length === 0) continue;

    messages.push({
      role,
      content: content.slice(0, MAX_STORED_CONTENT_CHARS),
    });
  }

  return messages.slice(-MAX_STORED_MESSAGES);
}

export function readSessionMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(SESSION_MESSAGES_KEY);
    if (!value) return [];
    return normalizeStoredMessages(JSON.parse(value));
  } catch {
    return [];
  }
}

export function writeSessionMessages(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;

  const normalized = normalizeStoredMessages(messages);
  try {
    if (normalized.length === 0) {
      window.localStorage.removeItem(SESSION_MESSAGES_KEY);
      return;
    }
    window.localStorage.setItem(SESSION_MESSAGES_KEY, JSON.stringify(normalized));
  } catch {
    // Storage can fail in private mode or when quota is exhausted.
  }
}

export function clearSessionMessages() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(SESSION_MESSAGES_KEY);
  } catch {
    // Nothing useful to do if storage is unavailable.
  }
}
