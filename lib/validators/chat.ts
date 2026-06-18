import { z } from "zod";
import { isModeId, type ModeId } from "../../data/modes";

export const MAX_CHAT_MESSAGES = 50;
export const MAX_CHAT_CONTENT_CHARS = 12_000;

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .min(1, "Message content is required.")
    .max(
      MAX_CHAT_CONTENT_CHARS,
      `Message content must be ${MAX_CHAT_CONTENT_CHARS} characters or fewer.`
    )
    .refine((value) => value.trim().length > 0, {
      message: "Message content cannot be blank.",
    }),
});

export const chatRequestSchema = z.object({
  mode: z
    .string({ required_error: "Mode is required." })
    .refine(isModeId, { message: "Unknown assistant mode." })
    .transform((value) => value as ModeId),
  messages: z
    .array(chatMessageSchema)
    .min(1, "At least one message is required.")
    .max(MAX_CHAT_MESSAGES, `No more than ${MAX_CHAT_MESSAGES} messages allowed.`),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export function formatZodIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}
