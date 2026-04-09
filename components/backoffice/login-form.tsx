"use client";

import { useActionState } from "react";
import { loginBackoffice, initialBackofficeLoginState } from "@/app/backoffice/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({ disabled }: { disabled?: boolean }) {
  const [state, formAction] = useActionState(loginBackoffice, initialBackofficeLoginState);

  return (
    <form action={formAction} className="space-y-6 border border-white/10 bg-zinc-950 p-8">
      <label className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Password</span>
        <Input name="password" type="password" placeholder="Introduz a password do backoffice" disabled={disabled} />
      </label>

      {state.error ? <p className="text-sm text-rose-300">{state.error}</p> : null}

      <Button type="submit" className="w-full" disabled={disabled}>
        Entrar
      </Button>
    </form>
  );
}
