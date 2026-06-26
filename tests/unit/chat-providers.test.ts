import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildProviderRequest,
  extractProviderDelta,
  getMissingProviderKeyMessage,
  resolveChatProvider,
} from "../../lib/ai/providers";
import {
  parseChatStreamData,
  serializeChatStreamEvent,
} from "../../lib/ai/stream-events";

describe("chat providers", () => {
  it("defaults to Anthropic when only an Anthropic key is configured", () => {
    assert.equal(
      resolveChatProvider({ ANTHROPIC_API_KEY: "test-key" }),
      "anthropic"
    );
    assert.equal(
      resolveChatProvider({ ANTHROPIC_AUTH_TOKEN: "test-token" }),
      "anthropic"
    );
  });

  it("keeps OpenRouter as the default provider", () => {
    assert.equal(resolveChatProvider({}), "openrouter");
    assert.equal(
      resolveChatProvider({
        OPENROUTER_API_KEY: "test-key",
        ANTHROPIC_API_KEY: "test-key",
      }),
      "openrouter"
    );
  });

  it("accepts claude as an Anthropic provider alias", () => {
    assert.equal(resolveChatProvider({ AI_PROVIDER: "claude" }), "anthropic");
  });

  it("rejects unknown provider names", () => {
    assert.equal(resolveChatProvider({ AI_PROVIDER: "unknown" }), null);
  });

  it("reports missing provider keys without exposing configured secrets", () => {
    assert.equal(
      getMissingProviderKeyMessage("anthropic", {}),
      "Chat is not configured. Missing Anthropic API key or auth token."
    );
    assert.equal(
      getMissingProviderKeyMessage("openrouter", {}),
      "Chat is not configured. Missing OpenRouter API key."
    );
  });

  it("builds an Anthropic Messages API streaming request", () => {
    const request = buildProviderRequest(
      "anthropic",
      { ANTHROPIC_API_KEY: "test-key", ANTHROPIC_MODEL: "claude-haiku-4-5" },
      "system prompt",
      [{ role: "user", content: "hello" }]
    );

    assert.equal(request.url, "https://api.anthropic.com/v1/messages");
    assert.equal(request.init.method, "POST");

    const headers = request.init.headers as Record<string, string>;
    assert.equal(headers["x-api-key"], "test-key");
    assert.equal(headers["anthropic-version"], "2023-06-01");

    const body = JSON.parse(String(request.init.body));
    assert.equal(body.model, "claude-haiku-4-5");
    assert.equal(body.stream, true);
    assert.equal(body.system, "system prompt");
    assert.deepEqual(body.messages, [{ role: "user", content: "hello" }]);
  });

  it("builds an Anthropic-compatible proxy request", () => {
    const request = buildProviderRequest(
      "anthropic",
      {
        ANTHROPIC_AUTH_TOKEN: "test-token",
        ANTHROPIC_BASE_URL: "https://api.example.test",
        ANTHROPIC_DEFAULT_HAIKU_MODEL: "proxy-haiku",
      },
      "system prompt",
      [{ role: "user", content: "hello" }]
    );

    assert.equal(request.url, "https://api.example.test/v1/messages");

    const headers = request.init.headers as Record<string, string>;
    assert.equal(headers["x-api-key"], "test-token");

    const body = JSON.parse(String(request.init.body));
    assert.equal(body.model, "proxy-haiku");
  });

  it("resolves Anthropic model aliases for compatible proxies", () => {
    const request = buildProviderRequest(
      "anthropic",
      {
        ANTHROPIC_AUTH_TOKEN: "test-token",
        ANTHROPIC_MODEL: "opus",
        ANTHROPIC_DEFAULT_OPUS_MODEL: "proxy-opus",
      },
      "system prompt",
      [{ role: "user", content: "hello" }]
    );

    const body = JSON.parse(String(request.init.body));
    assert.equal(body.model, "proxy-opus");
  });

  it("extracts OpenRouter streaming deltas", () => {
    assert.equal(
      extractProviderDelta("openrouter", {
        choices: [{ delta: { content: "Hello" } }],
      }),
      "Hello"
    );
  });

  it("extracts Anthropic text deltas and ignores non-text events", () => {
    assert.equal(
      extractProviderDelta("anthropic", {
        type: "content_block_delta",
        index: 0,
        delta: { type: "text_delta", text: "Hello" },
      }),
      "Hello"
    );
    assert.equal(
      extractProviderDelta("anthropic", {
        type: "message_start",
        message: { content: [] },
      }),
      ""
    );
  });

  it("serializes normalized chat stream events", () => {
    assert.equal(
      serializeChatStreamEvent({ type: "delta", delta: "Hello" }),
      'data: {"type":"delta","delta":"Hello"}\n\n'
    );
    assert.equal(
      serializeChatStreamEvent({ type: "done" }),
      'data: {"type":"done"}\n\n'
    );
  });

  it("parses normalized and legacy chat stream events", () => {
    assert.deepEqual(
      parseChatStreamData('{"type":"delta","delta":"Hello"}'),
      { type: "delta", delta: "Hello" }
    );
    assert.deepEqual(parseChatStreamData('{"delta":"Hello"}'), {
      type: "delta",
      delta: "Hello",
    });
    assert.deepEqual(parseChatStreamData("[DONE]"), { type: "done" });
    assert.equal(parseChatStreamData("not json"), null);
  });

  it("parses typed runtime stream events", () => {
    assert.deepEqual(parseChatStreamData('{"type":"state","state":"thinking"}'), {
      type: "state",
      state: "thinking",
      message: undefined,
    });
    assert.deepEqual(
      parseChatStreamData(
        '{"type":"avatar","state":"speaking","expression":"happy","intensity":0.8,"source":"assistant"}'
      ),
      {
        type: "avatar",
        state: "speaking",
        expression: "happy",
        intensity: 0.8,
        source: "assistant",
      }
    );
    assert.deepEqual(
      parseChatStreamData(
        '{"type":"source","documentId":"doc-1","page":3,"snippet":"quoted source","score":0.91}'
      ),
      {
        type: "source",
        id: undefined,
        documentId: "doc-1",
        title: undefined,
        page: 3,
        snippet: "quoted source",
        score: 0.91,
      }
    );
    assert.deepEqual(
      parseChatStreamData('{"type":"memory","action":"write","label":"study goal"}'),
      {
        type: "memory",
        action: "write",
        id: undefined,
        label: "study goal",
      }
    );
    assert.deepEqual(parseChatStreamData('{"type":"error","message":"Nope"}'), {
      type: "error",
      code: undefined,
      message: "Nope",
    });
  });
});
