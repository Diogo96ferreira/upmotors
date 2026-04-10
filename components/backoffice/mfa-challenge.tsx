"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function MfaChallenge() {
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase nao esta configurado no frontend.");
      setLoading(false);
      return;
    }

    let active = true;

    (async () => {
      const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (!active) {
        return;
      }

      if (aal.data.currentLevel === "aal2") {
        window.location.href = "/backoffice";
        return;
      }

      const factors = await supabase.auth.mfa.listFactors();

      if (!active) {
        return;
      }

      if (factors.error) {
        setError(factors.error.message);
        setLoading(false);
        return;
      }

      const verifiedTotp = factors.data.totp.find((factor) => factor.status === "verified");

      if (!verifiedTotp) {
        window.location.href = "/backoffice/mfa/enroll";
        return;
      }

      setFactorId(verifiedTotp.id);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();

    const supabase = createSupabaseBrowserClient();

    if (!supabase || !factorId) {
      return;
    }

    setSubmitting(true);
    setError("");

    const verify = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    });

    if (verify.error) {
      setError(verify.error.message);
      setSubmitting(false);
      return;
    }

    window.location.href = "/backoffice";
  }

  return (
    <div className="space-y-6 border border-white/10 bg-zinc-950 p-10">
      <div className="space-y-3 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">2FA</p>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
          Confirmar codigo do Authenticator
        </h1>
        <p className="text-zinc-400">
          Introduz o codigo atual da tua app Google Authenticator para entrar no backoffice.
        </p>
      </div>

      {loading ? <p className="text-center text-sm text-zinc-400">A preparar desafio MFA...</p> : null}

      {!loading ? (
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Codigo de 6 digitos</span>
            <Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="123456" required />
          </label>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "A validar" : "Confirmar acesso"}
          </Button>
        </form>
      ) : null}

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
