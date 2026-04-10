import { redirect } from "next/navigation";
import { createSupabaseAuthServerClient } from "@/lib/supabase-auth-server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function getBackofficeUser() {
  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function isAuthorizedBackofficeUser(email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return false;
  }

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("email")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error("Erro ao validar admin_users:", error);
    return false;
  }

  return Boolean(data);
}

export async function getBackofficeMfaState() {
  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    return {
      currentLevel: null,
      nextLevel: null,
      needsEnroll: false,
      needsChallenge: false,
    };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return {
      currentLevel: null,
      nextLevel: null,
      needsEnroll: false,
      needsChallenge: false,
    };
  }

  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel(
    session.access_token
  );

  if (error) {
    console.error("Erro ao validar AAL do utilizador:", error);
    return {
      currentLevel: null,
      nextLevel: null,
      needsEnroll: false,
      needsChallenge: false,
    };
  }

  const currentLevel = data.currentLevel ?? null;
  const nextLevel = data.nextLevel ?? null;

  return {
    currentLevel,
    nextLevel,
    needsEnroll: currentLevel !== "aal2" && nextLevel !== "aal2",
    needsChallenge: currentLevel !== "aal2" && nextLevel === "aal2",
  };
}

export async function requireBackofficeUser() {
  const user = await getBackofficeUser();

  if (!user) {
    redirect("/backoffice/login");
  }

  const authorized = await isAuthorizedBackofficeUser(user.email);

  if (!authorized) {
    redirect("/backoffice/login?unauthorized=1");
  }

  const mfa = await getBackofficeMfaState();

  if (mfa.needsEnroll) {
    redirect("/backoffice/mfa/enroll");
  }

  if (mfa.needsChallenge) {
    redirect("/backoffice/mfa/challenge");
  }

  return user;
}
