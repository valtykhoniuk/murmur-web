import type { TokenResponse } from "../entities/types";
import { apiFetch } from "./api";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function clearSession(): void {
  localStorage.removeItem("token");
}

export async function ensureSession(options?: { demo?: boolean }): Promise<boolean> {
  if (options?.demo) {
    clearSession();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const data = await apiFetch<TokenResponse>("/auth/demo", { method: "POST" });
        localStorage.setItem("token", data.access_token);
        return true;
      } catch {
        if (attempt < 2) {
          await sleep(3000);
        }
      }
    }

    return false;
  }

  return Boolean(localStorage.getItem("token"));
}
