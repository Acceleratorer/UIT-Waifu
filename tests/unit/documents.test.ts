import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAX_DOCUMENT_FILE_BYTES,
  formatFileSize,
  validateDocumentFile,
} from "../../features/documents/validation";

describe("document validation", () => {
  it("accepts supported document formats", () => {
    assert.deepEqual(
      validateDocumentFile({
        name: "lecture.pdf",
        size: 1024,
        type: "application/pdf",
      }),
      { ok: true, label: "PDF" }
    );

    assert.deepEqual(
      validateDocumentFile({
        name: "notes.docx",
        size: 1024,
        type: "",
      }),
      { ok: true, label: "DOCX" }
    );
  });

  it("rejects empty, oversized, and unsupported files", () => {
    assert.deepEqual(validateDocumentFile({ name: "empty.pdf", size: 0 }), {
      ok: false,
      reason: "File is empty.",
    });

    assert.deepEqual(
      validateDocumentFile({
        name: "huge.pdf",
        size: MAX_DOCUMENT_FILE_BYTES + 1,
      }),
      {
        ok: false,
        reason: "File is larger than 10.0 MB.",
      }
    );

    assert.deepEqual(validateDocumentFile({ name: "image.png", size: 1024 }), {
      ok: false,
      reason: "Supported formats: PDF, DOCX, TXT.",
    });
  });

  it("formats file sizes", () => {
    assert.equal(formatFileSize(0), "0 B");
    assert.equal(formatFileSize(512), "512 B");
    assert.equal(formatFileSize(1536), "1.5 KB");
    assert.equal(formatFileSize(2 * 1024 * 1024), "2.0 MB");
  });
});
