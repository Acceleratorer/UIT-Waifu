import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getSupabasePublicConfig } from "../../lib/supabase/config";

describe("getSupabasePublicConfig", () => {
  it("returns null when Supabase public env is missing", () => {
    assert.equal(getSupabasePublicConfig({}), null);
    assert.equal(
      getSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      }),
      null
    );
  });

  it("returns trimmed public Supabase config", () => {
    assert.deepEqual(
      getSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_URL: " https://example.supabase.co ",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: " anon-key ",
      }),
      {
        url: "https://example.supabase.co",
        anonKey: "anon-key",
      }
    );
  });
});

