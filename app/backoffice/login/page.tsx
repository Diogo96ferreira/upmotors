import { redirect } from "next/navigation";
import { GoogleLoginTest } from "@/components/backoffice/google-login-test";
import { LogoutButton } from "@/components/backoffice/logout-button";
import {
  getBackofficeMfaState,
  getBackofficeUser,
  isAuthorizedBackofficeUser,
} from "@/lib/backoffice-session";

type Props = {
  searchParams?: Promise<{ unauthorized?: string }>;
};

export default async function BackofficeLoginPage({ searchParams }: Props) {
  const user = await getBackofficeUser();
  const params = searchParams ? await searchParams : undefined;
  const unauthorized = params?.unauthorized === "1";

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
    <section className="container-shell py-24 pt-32">
      <div className="mx-auto max-w-xl space-y-6">
        {user && unauthorized ? (
          <div className="space-y-4 border border-amber-500/20 bg-amber-500/10 p-6 text-center">
            <p className="text-sm font-medium text-amber-100">
              A conta {user.email ?? user.id} nao esta autorizada a entrar no backoffice.
            </p>
            <div className="flex justify-center">
              <LogoutButton />
            </div>
          </div>
        ) : (
          <GoogleLoginTest />
        )}
      </div>
    </section>
  );
}
