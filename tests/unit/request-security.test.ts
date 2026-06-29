import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CONTENT_SECURITY_POLICY_REPORT_ONLY,
  getUrlHost,
  isJsonContentType,
  isSameOriginRequest,
  SECURITY_HEADERS,
} from "../../lib/http/request-security";

describe("request security helpers", () => {
  it("accepts only JSON content types", () => {
    assert.equal(isJsonContentType("application/json"), true);
    assert.equal(isJsonContentType("Application/JSON; charset=utf-8"), true);
    assert.equal(isJsonContentType("text/plain"), false);
    assert.equal(isJsonContentType(null), false);
  });

  it("extracts lowercase URL hosts", () => {
    assert.equal(getUrlHost("https://ACCEL.io.vn/waifu"), "accel.io.vn");
    assert.equal(getUrlHost("not a url"), null);
  });

  it("rejects cross-origin browser requests", () => {
    assert.equal(
      isSameOriginRequest(
        new Request("https://accel.io.vn/waifu/api/chat", {
          headers: { origin: "https://evil.example" },
        })
      ),
      false
    );

    assert.equal(
      isSameOriginRequest(
        new Request("https://accel.io.vn/waifu/api/chat", {
          headers: { origin: "https://accel.io.vn" },
        })
      ),
      true
    );
  });

  it("allows non-browser server requests without origin headers", () => {
    assert.equal(
      isSameOriginRequest(new Request("https://accel.io.vn/waifu/api/chat")),
      true
    );
  });

  it("defines a report-only CSP with high-value browser restrictions", () => {
    assert.equal(
      SECURITY_HEADERS["Content-Security-Policy-Report-Only"],
      CONTENT_SECURITY_POLICY_REPORT_ONLY
    );
    assert.match(CONTENT_SECURITY_POLICY_REPORT_ONLY, /object-src 'none'/);
    assert.match(CONTENT_SECURITY_POLICY_REPORT_ONLY, /base-uri 'self'/);
    assert.match(CONTENT_SECURITY_POLICY_REPORT_ONLY, /frame-ancestors 'self'/);
    assert.match(
      CONTENT_SECURITY_POLICY_REPORT_ONLY,
      /connect-src .*https:\/\/\*\.supabase\.co/
    );
  });
});
