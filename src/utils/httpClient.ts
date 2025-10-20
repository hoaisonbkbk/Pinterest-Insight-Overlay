// src/utils/httpClient.ts
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export interface HttpRequestOptions {
  method?: HttpMethod;
  params?: Record<string, string | number>;
  query?: Record<string, string | number | undefined>;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials; // 'omit' | 'same-origin' | 'include'
  cacheKey?: string; // optional: sessionStorage cache key
  cacheTtlMs?: number; // optional cache ttl in ms
}

function serializeQuery(query: Record<string, any> | undefined) {
  if (!query) return "";
  const qs = Object.entries(query)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return qs ? `?${qs}` : "";
}

export async function httpRequest<T = any>(
  url: string,
  options: HttpRequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    params,
    query,
    headers = {},
    body,
    credentials = "same-origin",
    cacheKey,
    cacheTtlMs = 1000 * 60 * 2 // default 2 minutes
  } = options;

  // basic param substitution
  let finalUrl = url;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      finalUrl = finalUrl.replace(`:${k}`, encodeURIComponent(String(v)));
    }
  }

  finalUrl += serializeQuery(query);

  // cache read
  if (cacheKey && typeof window !== "undefined" && sessionStorage) {
    try {
      const raw = sessionStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.ts && Date.now() - parsed.ts < cacheTtlMs && parsed.data) {
          return parsed.data as T;
        }
      }
    } catch (err) {
      // ignore cache parse errors
    }
  }

  const defaultHeaders: HeadersInit = {
    Accept: "application/json, text/plain, */*",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };

  const fetchOptions: RequestInit = {
    method,
    headers: defaultHeaders,
    credentials,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const res = await fetch(finalUrl, fetchOptions);

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} - ${txt}`);
    }

    const text = await res.text();
    let parsed: any = null;
    if (!text) parsed = null;
    else {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }

    // cache write
    if (cacheKey && typeof window !== "undefined" && sessionStorage) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: parsed }));
      } catch (err) { /* ignore */ }
    }

    return parsed as T;
  } catch (err) {
    console.error("httpRequest error:", err);
    throw err;
  }
}
