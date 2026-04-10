import { redirect } from "next/navigation";
import { GoogleLoginTest } from "@/components/backoffice/google-login-test";
import { LogoutButton } from "@/components/backoffice/logout-button";
import {
  getBackofficeMfaState,
  getBackofficeUser,
  isAuthorizedBackofficeUser,
} from "@/lib/backoffice-session";

type Props = {
  searchParams?: Promise<{ unauthorized?: string; email?: string; error?: string }>;
};

export default async function BackofficeLoginPage({ searchParams }: Props) {
  const user = await getBackofficeUser();
  const params = searchParams ? await searchParams : undefined;
  const unauthorized = params?.unauthorized === "1";
  const deniedEmail = params?.email;
  const authError = params?.error;
  const authorized = user ? await isAuthorizedBackofficeUser(user.email) : false;

  if (user && authorized) {
    const mfa = await getBackofficeMfaState();

    if (mfa.currentLevel === "aal2") {
      redirect("/backoffice");
    }

    if (mfa.needsEnroll) {
      redirect("/backoffice/mfa/enroll");
    }

    if (mfa.needsChallenge) {
      redirect("/backoffice/mfa/challenge");
    }
  }

  return (
    <section className="relative min-h-[78svh] overflow-hidden pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.055),transparent_18%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.03),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_18rem)]" />
      <div className="container-shell relative z-10 flex min-h-[78svh] items-center justify-center py-16">
        <div className="w-full max-w-2xl">
          {unauthorized ? (
            <div className="space-y-4 border border-amber-400/25 bg-amber-950/50 p-8 text-center backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.3em] text-amber-200/70">
                Acesso recusado
              </p>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase tracking-tight">
                Conta nao autorizada
              </h1>
              <p className="text-sm font-medium leading-7 text-amber-100">
                {deniedEmail
                  ? `A conta ${deniedEmail} nao esta autorizada a entrar no backoffice.`
                  : "Esta conta nao esta autorizada a entrar no backoffice."}
              </p>
              <div className="flex justify-center">
                <LogoutButton />
              </div>
            </div>
          ) : authError ? (
            <div className="space-y-4 border border-rose-400/25 bg-rose-950/40 p-8 text-center backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.3em] text-rose-200/70">
                Autenticacao
              </p>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase tracking-tight">
                Falha no login Google
              </h1>
              <p className="text-sm font-medium leading-7 text-rose-100">
                Nao foi possivel concluir a autenticacao. Tente novamente.
              </p>
            </div>
          ) : (
            <GoogleLoginTest />
          )}
        </div>
      </div>
    </section>
  );
}
