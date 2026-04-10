"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type EnrollState = {
  factorId: string;
  qrCode: string;
  secret: string;
};

export function MfaEnroll() {
  const [state, setState] = useState<EnrollState | null>(null);
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

      if (aal.error) {
        setError(aal.error.message);
        setLoading(false);
        return;
      }

      if (aal.data?.currentLevel === "aal2") {
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

      if (factors.data.totp.some((factor) => factor.status === "verified")) {
        window.location.href = "/backoffice/mfa/challenge";
        return;
      }

      const enrolled = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Google Authenticator",
      });

      if (!active) {
        return;
      }

      if (enrolled.error || !enrolled.data.totp) {
        setError(enrolled.error?.message ?? "Nao foi possivel iniciar a configuracao do 2FA.");
        setLoading(false);
        return;
      }

      setState({
        factorId: enrolled.data.id,
        qrCode: enrolled.data.totp.qr_code,
        secret: enrolled.data.totp.secret,
      });
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();

    const supabase = createSupabaseBrowserClient();

    if (!supabase || !state) {
      return;
    }

    setSubmitting(true);
    setError("");

    const challenge = await supabase.auth.mfa.challenge({ factorId: state.factorId });

    if (challenge.error || !challenge.data) {
      setError(challenge.error?.message ?? "Nao foi possivel criar o desafio MFA.");
      setSubmitting(false);
      return;
    }

    const verify = await supabase.auth.mfa.verify({
      factorId: state.factorId,
      challengeId: challenge.data.id,
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
          Configurar Google Authenticator
        </h1>
        <p className="text-zinc-400">
          Faz a ligacao da tua conta a uma app Authenticator e confirma o codigo de 6 digitos
          para ativar o acesso seguro ao backoffice.
        </p>
      </div>

      {loading ? <p className="text-center text-sm text-zinc-400">A preparar configuracao MFA...</p> : null}

      {state ? (
        <>
          <div className="space-y-5 border border-white/10 bg-black/20 p-6">
            <div className="space-y-2 border-b border-white/10 pb-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Passo 1</p>
              <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-100">
                Abrir a app
              </h2>
              <p className="text-sm leading-6 text-zinc-400">
                Abre o Google Authenticator no telemovel e escolhe adicionar uma nova conta.
              </p>
            </div>
            <div className="space-y-2 border-b border-white/10 pb-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Passo 2</p>
              <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-100">
                Fazer scan
              </h2>
              <p className="text-sm leading-6 text-zinc-400">
                Faz scan do QR code abaixo. Se nao resultar, copia o segredo manual e adiciona-o
                na app.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Passo 3</p>
              <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-100">
                Confirmar codigo
              </h2>
              <p className="text-sm leading-6 text-zinc-400">
                Introduz o codigo de 6 digitos que a app gerar neste momento e conclui a ativacao.
              </p>
            </div>
          </div>

          <div className="space-y-4 border border-white/10 bg-black/30 p-6 text-center">
            <img src={state.qrCode} alt="QR code MFA" className="mx-auto h-56 w-56 bg-white p-3" />
            <p className="text-sm text-zinc-400">
              Se nao conseguires fazer scan, escolhe a opcao de introducao manual na app e usa
              este segredo:
            </p>
            <code className="block break-all text-sm text-zinc-200">{state.secret}</code>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Codigo de 6 digitos</span>
              <Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="123456" required />
            </label>

            <p className="text-sm leading-6 text-zinc-400">
              O codigo muda de poucos em poucos segundos. Se der erro, espera pelo proximo codigo
              e tenta novamente.
            </p>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "A validar" : "Ativar 2FA"}
            </Button>
          </form>
        </>
      ) : null}

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
