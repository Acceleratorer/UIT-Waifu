/// <reference types="@cloudflare/workers-types" />
import { SECURITY_HEADERS } from "../../lib/http/request-security";

const VERSION = "0.1.0";

export const onRequestGet: PagesFunction = async () => {
  return new Response(
    JSON.stringify({
      status: "ok",
      version: VERSION,
      time: new Date().toISOString(),
    }),
    {
      headers: {
        ...SECURITY_HEADERS,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
};
