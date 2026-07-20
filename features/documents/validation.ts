export const MAX_DOCUMENT_FILE_BYTES = 10 * 1024 * 1024;

export const SUPPORTED_DOCUMENT_TYPES = [
  {
    label: "PDF",
    extensions: [".pdf"],
    mimeTypes: ["application/pdf", "application/x-pdf"],
  },
  {
    label: "DOCX",
    extensions: [".docx"],
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  {
    label: "TXT",
    extensions: [".txt"],
    mimeTypes: ["text/plain"],
  },
] as const;

export type SupportedDocumentLabel =
  (typeof SUPPORTED_DOCUMENT_TYPES)[number]["label"];

export interface DocumentFileLike {
  name: string;
  size: number;
  type?: string;
}

export type DocumentValidationResult =
  | { ok: true; label: SupportedDocumentLabel }
  | { ok: false; reason: string };

export const DOCUMENT_ACCEPT = SUPPORTED_DOCUMENT_TYPES.flatMap((type) => [
  ...type.extensions,
  ...type.mimeTypes,
]).join(",");

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateDocumentFile(
  file: DocumentFileLike
): DocumentValidationResult {
  if (!file.name.trim()) {
    return { ok: false, reason: "File name is required." };
  }

  if (file.size <= 0) {
    return { ok: false, reason: "File is empty." };
  }

  if (file.size > MAX_DOCUMENT_FILE_BYTES) {
    return {
      ok: false,
      reason: `File is larger than ${formatFileSize(MAX_DOCUMENT_FILE_BYTES)}.`,
    };
  }

  const normalizedName = file.name.toLowerCase();
  const normalizedMime = file.type?.toLowerCase().trim() ?? "";

  const matchedType = SUPPORTED_DOCUMENT_TYPES.find(
    (type) =>
      type.extensions.some((extension) =>
        normalizedName.endsWith(extension)
      ) || type.mimeTypes.some((mimeType) => mimeType === normalizedMime)
  );

  if (!matchedType) {
    return { ok: false, reason: "Supported formats: PDF, DOCX, TXT." };
  }

  return { ok: true, label: matchedType.label };
}
