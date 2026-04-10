"use client";

import { useEffect, useState } from "react";
import { Chrome, KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type SessionUser = {
  email?: string;
  id: string;
};

export function GoogleLoginTest() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [submittingGoogle, setSubmittingGoogle] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getUser().then(({ data, error: userError }) => {
      if (!active) {
        return;
      }

      if (userError) {
        setError(userError.message);
      }

      setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) {
        return;
      }

      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleGoogleLogin() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    setError("");
    setSubmittingGoogle(true);

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/backoffice`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setSubmittingGoogle(false);
    }
  }

  async function handlePasswordLogin(event: React.FormEvent) {
    event.preventDefault();

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    setError("");
    setSubmittingPassword(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setSubmittingPassword(false);
      return;
    }

    window.location.href = "/backoffice/login";
  }

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    window.location.href = "/backoffice/login";
  }

  return (
    <div className="space-y-8 border border-white/10 bg-zinc-950/90 p-8 backdrop-blur-xl md:p-10">
      <div className="space-y-3 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Backoffice Up Motors</p>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
          Iniciar sessao
        </h1>
        <p className="text-zinc-400">
          Aceda com email e palavra-passe ou use o fluxo Google para entrar no cockpit operacional.
        </p>
      </div>

      <div className="space-y-4 text-center">
        {loading ? <p className="text-sm text-zinc-400">A verificar sessao...</p> : null}

        {!loading && user ? (
          <div className="space-y-3 border border-emerald-500/20 bg-emerald-950/40 p-5">
            <p className="text-sm font-medium text-emerald-200">Sessao ativa com sucesso.</p>
            <p className="text-sm text-emerald-100">{user.email ?? user.id}</p>
            <Button type="button" variant="outline" onClick={handleLogout}>
              Terminar sessao
            </Button>
          </div>
        ) : null}

        {!loading && !user ? (
          <div className="space-y-6 text-left">
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <label className="block space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@upmotors.pt"
                    className="pl-7"
                    required
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  Palavra-passe
                </span>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Introduza a sua palavra-passe"
                    className="pl-7"
                    required
                  />
                </div>
              </label>

              <Button type="submit" className="w-full" disabled={submittingPassword}>
                {submittingPassword ? "A entrar..." : "Entrar com email"}
              </Button>
            </form>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">ou</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full gap-2"
              disabled={submittingGoogle}
            >
              <Chrome className="h-4 w-4" />
              {submittingGoogle ? "A redirecionar..." : "Entrar com Google"}
            </Button>
          </div>
        ) : null}

        {error ? <p className="text-center text-sm text-rose-300">{error}</p> : null}
      </div>
    </div>
  );
}
