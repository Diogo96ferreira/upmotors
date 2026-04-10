"use client";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function LogoutButton() {
  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/backoffice/login";
  }

  return (
    <Button type="button" variant="outline" onClick={handleLogout}>
      Terminar sessao
    </Button>
  );
}
