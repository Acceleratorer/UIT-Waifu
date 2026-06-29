export const MAX_CHAT_REQUEST_BYTES = 750_000;

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

