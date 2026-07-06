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

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  try {
    return await apiFetchOnce<T>(path, options);
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Cannot reach server. Try again in a few seconds.");
    }
    throw err;
  }
}
