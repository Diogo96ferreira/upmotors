import Link from "next/link";

export default function BackofficeLoginPage() {
  return (
    <section className="container-shell py-24 pt-32">
      <div className="mx-auto max-w-xl space-y-6 border border-white/10 bg-zinc-950 p-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Backoffice Demo</p>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
          Login desativado
        </h1>
        <p className="text-zinc-400">
          Para esta fase de visualizacao, o backoffice esta aberto em modo demo.
        </p>
        <Link
          href="/backoffice"
          className="inline-flex h-12 items-center justify-center border border-transparent bg-white px-6 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-zinc-200"
        >
          Entrar no backoffice
        </Link>
      </div>
    </section>
  );
}
