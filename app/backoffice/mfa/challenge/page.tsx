import { redirect } from "next/navigation";
import { MfaChallenge } from "@/components/backoffice/mfa-challenge";
import { getBackofficeMfaState, getBackofficeUser, isAuthorizedBackofficeUser } from "@/lib/backoffice-session";

export default async function BackofficeMfaChallengePage() {
  const user = await getBackofficeUser();

  if (!user) {
    redirect("/backoffice/login");
  }

  const authorized = await isAuthorizedBackofficeUser(user.email);

  if (!authorized) {
    redirect("/backoffice/login?unauthorized=1");
  }

  const mfa = await getBackofficeMfaState();

  if (mfa.currentLevel === "aal2") {
    redirect("/backoffice");
  }

  if (mfa.needsEnroll) {
    redirect("/backoffice/mfa/enroll");
  }

  return (
    <section className="container-shell py-24 pt-32">
      <div className="mx-auto max-w-xl">
        <MfaChallenge />
      </div>
    </section>
  );
}
