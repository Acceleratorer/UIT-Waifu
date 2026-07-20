"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DOCUMENT_ACCEPT,
  formatFileSize,
  validateDocumentFile,
} from "@/features/documents/validation";

interface DocumentCandidate {
  id: string;
  name: string;
  size: number;
  status: "ready" | "blocked";
  detail: string;
}

function buildCandidate(file: File, index: number): DocumentCandidate {
  const validation = validateDocumentFile(file);

  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
    name: file.name,
    size: file.size,
    status: validation.ok ? "ready" : "blocked",
    detail: validation.ok ? validation.label : validation.reason,
  };
}

export function DocumentUploadPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<DocumentCandidate[]>([]);

  const readyCount = useMemo(
    () => documents.filter((document) => document.status === "ready").length,
    [documents]
  );

  function handleFiles(files: FileList | null) {
    if (!files) return;

    setDocuments((current) => [
      ...current,
      ...Array.from(files).map(buildCandidate),
    ]);
  }

  function removeDocument(id: string) {
    setDocuments((current) =>
      current.filter((document) => document.id !== id)
    );
  }

  return (
    <section className="w-full max-w-4xl">
      <div className="border-b border-foreground/10 pb-5">
        <p className="text-sm font-semibold text-teal-700 dark:text-teal-200">
          Phase 4
        </p>
        <h1 className="mt-2 text-3xl font-bold">Documents</h1>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <section className="rounded-2xl border border-white/45 bg-white/55 p-4 shadow-xl shadow-pink-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Document intake</h2>
              <p className="mt-1 text-sm text-foreground/55">
                PDF, DOCX, TXT up to 10 MB
              </p>
            </div>
            <div className="flex items-center gap-2">
              {documents.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setDocuments([])}>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Clear
                </Button>
              )}
              <Button onClick={() => inputRef.current?.click()}>
                <Upload className="h-4 w-4" aria-hidden="true" />
                Choose files
              </Button>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept={DOCUMENT_ACCEPT}
            className="sr-only"
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = "";
            }}
          />

          <div className="mt-4 min-h-[260px] rounded-xl border border-dashed border-foreground/15 bg-white/35 p-3 dark:bg-white/5">
            {documents.length === 0 ? (
              <div className="flex h-full min-h-[236px] flex-col items-center justify-center text-center">
                <FileText className="h-10 w-10 text-foreground/30" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-foreground/65">
                  No documents selected
                </p>
              </div>
            ) : (
              <ul className="grid gap-2">
                {documents.map((document) => (
                  <li
                    key={document.id}
                    className="flex min-w-0 items-center gap-3 rounded-lg border border-foreground/10 bg-white/60 p-3 dark:bg-black/20"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                        document.status === "ready"
                          ? "border-teal-400/25 bg-teal-500/10 text-teal-700 dark:text-teal-200"
                          : "border-red-400/25 bg-red-500/10 text-red-600 dark:text-red-300"
                      }`}
                    >
                      {document.status === "ready" ? (
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{document.name}</p>
                      <p className="mt-1 text-xs text-foreground/50">
                        {formatFileSize(document.size)} - {document.detail}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDocument(document.id)}
                      aria-label={`Remove ${document.name}`}
                      title={`Remove ${document.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <aside className="rounded-2xl border border-white/45 bg-white/55 p-4 shadow-xl shadow-teal-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
          <h2 className="text-lg font-semibold">Queue</h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm lg:grid-cols-1">
            <div className="border-b border-foreground/10 pb-3">
              <dt className="text-foreground/50">Selected</dt>
              <dd className="mt-1 text-2xl font-bold">{documents.length}</dd>
            </div>
            <div className="border-b border-foreground/10 pb-3">
              <dt className="text-foreground/50">Validated</dt>
              <dd className="mt-1 text-2xl font-bold">{readyCount}</dd>
            </div>
          </dl>
          <div className="mt-4 rounded-lg border border-amber-300/25 bg-amber-400/10 p-3 text-sm text-amber-800 dark:text-amber-100">
            Storage pending
          </div>
        </aside>
      </div>
    </section>
  );
}
