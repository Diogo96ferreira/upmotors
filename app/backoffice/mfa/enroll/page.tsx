import { redirect } from "next/navigation";
import { MfaEnroll } from "@/components/backoffice/mfa-enroll";
import { getBackofficeMfaState, getBackofficeUser, isAuthorizedBackofficeUser } from "@/lib/backoffice-session";

export default async function BackofficeMfaEnrollPage() {
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

  if (mfa.needsChallenge) {
    redirect("/backoffice/mfa/challenge");
  }

  return (
    <section className="container-shell py-24 pt-32">
      <div className="mx-auto max-w-xl">
        <MfaEnroll />
      </div>
    </section>
  );
}
