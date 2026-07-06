import type { TokenResponse } from "../entities/types";
import { apiFetch } from "./api";

export function clearSession(): void {
  localStorage.removeItem("token");
}

export async function ensureSession(options?: { demo?: boolean }): Promise<boolean> {
  if (options?.demo) {
    clearSession();

    try {
      const data = await apiFetch<TokenResponse>("/auth/demo", { method: "POST" });
      localStorage.setItem("token", data.access_token);
      return true;
    } catch {
      return false;
    }
  }

  return Boolean(localStorage.getItem("token"));
}
