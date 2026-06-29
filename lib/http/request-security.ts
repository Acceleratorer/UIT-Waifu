export const MAX_CHAT_REQUEST_BYTES = 750_000;

export const CONTENT_SECURITY_POLICY_REPORT_ONLY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://api.anthropic.com https://openrouter.ai https://*.supabase.co wss://*.supabase.co",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self'",
].join("; ");

export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy":
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  "Strict-Transport-Security": "max-age=15552000",
  "Content-Security-Policy-Report-Only": CONTENT_SECURITY_POLICY_REPORT_ONLY,
} as const;

export function isJsonContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  return contentType.toLowerCase().split(";")[0].trim() === "application/json";
}

export function getUrlHost(value: string | null): string | null {
  if (!value) return null;

  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

export function isSameOriginRequest(request: Request): boolean {
  const requestHost = getUrlHost(request.url);
  const originHost = getUrlHost(request.headers.get("origin"));
  const refererHost = getUrlHost(request.headers.get("referer"));

  if (!requestHost) return false;
  if (originHost) return originHost === requestHost;
  if (refererHost) return refererHost === requestHost;

  return true;
}
