"use server";

import { redirect } from "next/navigation";
import {
  clearBackofficeSession,
  createBackofficeSession,
  isBackofficePasswordConfigured,
} from "@/lib/backoffice-auth";

export type BackofficeLoginState = {
  error: string;
};

export async function loginBackoffice(
  _prevState: BackofficeLoginState,
  formData: FormData
): Promise<BackofficeLoginState> {
  if (!isBackofficePasswordConfigured()) {
    return {
      error: "Define a variavel BACKOFFICE_PASSWORD para ativares o backoffice.",
    };
  }

  const password = typeof formData.get("password") === "string" ? String(formData.get("password")).trim() : "";

  if (!password || password !== process.env.BACKOFFICE_PASSWORD) {
    return {
      error: "Password invalida.",
    };
  }

  await createBackofficeSession();
  redirect("/backoffice");
}

export async function logoutBackoffice() {
  await clearBackofficeSession();
  redirect("/backoffice/login");
}
