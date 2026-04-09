"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type SessionUser = {
  email?: string;
  id: string;
};

export function GoogleLoginTest() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setError("Supabase nao esta configurado no frontend.");
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
    if (!supabase) {
      setError("Supabase nao esta configurado no frontend.");
      return;
    }

    setError("");

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/backoffice/login`,
      },
    });

    if (signInError) {
      setError(signInError.message);
    }
  }

  async function handleLogout() {
    if (!supabase) {
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
    }
  }

  return (
    <div className="space-y-6 border border-white/10 bg-zinc-950 p-10">
      <div className="space-y-3 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Teste rapido</p>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
          Login com Google
        </h1>
        <p className="text-zinc-400">
          Este teste confirma se o OAuth com Google abre, autentica e volta ao frontend com sessao.
        </p>
      </div>

      <div className="space-y-4 border border-white/10 bg-black/30 p-6 text-left">
        <p className="text-sm text-zinc-300">Fluxo esperado:</p>
        <ol className="space-y-2 text-sm text-zinc-400">
          <li>1. Clicar em "Entrar com Google"</li>
          <li>2. Fazer login na conta Google</li>
          <li>3. Voltar a esta pagina autenticado</li>
        </ol>
      </div>

      <div className="space-y-4 text-center">
        {loading ? <p className="text-sm text-zinc-400">A verificar sessao...</p> : null}

        {!loading && user ? (
          <div className="space-y-3 border border-emerald-500/20 bg-emerald-500/10 p-5">
            <p className="text-sm font-medium text-emerald-200">Sessao ativa com sucesso.</p>
            <p className="text-sm text-emerald-100">{user.email ?? user.id}</p>
            <Button type="button" variant="outline" onClick={handleLogout}>
              Terminar sessao
            </Button>
          </div>
        ) : null}

        {!loading && !user ? (
          <Button type="button" onClick={handleGoogleLogin}>
            Entrar com Google
          </Button>
        ) : null}

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      </div>
    </div>
  );
}
