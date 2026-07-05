type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export function apiUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "/api";
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export async function apiFetch<T>(
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

  return response.json() as Promise<T>;
}
