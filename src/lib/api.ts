type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export function apiUrl(path: string): string {
  const raw = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
  const base = raw ? raw : "/api";
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

async function apiFetchOnce<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;
  const mergedHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  const token = localStorage.getItem("token");
  if (token) {
    (mergedHeaders as Record<string, string>)["Authorization"] =
      `Bearer ${token}`;
  }

  const response = await fetch(apiUrl(path), {
    ...rest,
    headers: mergedHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const errorBody = (await response.json()) as { detail?: unknown };
      if (typeof errorBody.detail === "string") {
        message = errorBody.detail;
      }
    } catch {
      // keep generic message
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

function isRetryableApiError(err: unknown): boolean {
  if (!(err instanceof Error)) {
    return false;
  }

  return /API error: (500|502|503|504)/.test(err.message);
}

function retryDelayMs(attempt: number): number {
  return 800 * (attempt + 1);
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
  retries = 2,
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await apiFetchOnce<T>(path, options);
    } catch (err) {
      if (attempt < retries && isRetryableApiError(err)) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs(attempt)));
        continue;
      }

      if (err instanceof TypeError) {
        throw new Error("Cannot reach server. Try again in a few seconds.");
      }
      throw err;
    }
  }

  throw new Error("API request failed");
}
