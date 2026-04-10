import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[78svh] items-center overflow-hidden pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_24%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.035),transparent_22%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_20rem)]" />
      <div className="container-shell relative z-10">
        <div className="grid gap-10 overflow-hidden border border-white/10 bg-black/65 p-8 backdrop-blur-xl md:p-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-10 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
            <div className="space-y-5">
              <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">Erro de navegação</p>
              <div className="font-[family-name:var(--font-heading)] text-7xl font-bold leading-none tracking-tight text-white/85 md:text-8xl">
                404
              </div>
              <h1 className="max-w-md font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight md:text-5xl">
                Página não encontrada
              </h1>
              <p className="max-w-xl text-lg leading-8 text-zinc-400">
                O conteúdo que procurava pode ter mudado de localização, deixado de estar disponível
                ou ainda não ter sido publicado no catálogo.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-white/8 bg-zinc-950/80 p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Sugestão</p>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Volte ao stock para explorar as viaturas publicadas e aceder aos detalhes corretos.
                </p>
              </div>
              <div className="border border-white/8 bg-zinc-950/80 p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Atalho</p>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Se vinha do backoffice, confirme se o `slug` foi alterado durante a edição do carro.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-8">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">Continuar</p>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase tracking-tight">
                Escolha o próximo passo
              </h2>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/stock" className={cn(buttonVariants(), "gap-2")}>
                <Search className="h-4 w-4" />
                Explorar stock
              </Link>
              <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>
                <ArrowLeft className="h-4 w-4" />
                Voltar ao início
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
