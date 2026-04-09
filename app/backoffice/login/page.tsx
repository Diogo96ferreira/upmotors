import { GoogleLoginTest } from "@/components/backoffice/google-login-test";

export default function BackofficeLoginPage() {
  return (
    <section className="container-shell py-24 pt-32">
      <div className="mx-auto max-w-xl">
        <GoogleLoginTest />
      </div>
    </section>
  );
}
