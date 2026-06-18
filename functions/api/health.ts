/// <reference types="@cloudflare/workers-types" />

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
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
};
