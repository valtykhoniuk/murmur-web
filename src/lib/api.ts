type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function apiUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "/api";
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError;
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

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const maxAttempts = 3;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await apiFetchOnce<T>(path, options);
    } catch (err) {
      const canRetry = isNetworkError(err) && attempt < maxAttempts - 1;
      if (canRetry) {
        await sleep(3000);
        continue;
      }

      if (isNetworkError(err)) {
        throw new Error(
          "Cannot reach server. If this is the live demo, wait ~30s and try again (free tier cold start).",
        );
      }

      throw err;
    }
  }

  throw new Error("Cannot reach server.");
}
