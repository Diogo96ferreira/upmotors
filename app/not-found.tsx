import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center pt-24">
      <div className="container-shell text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">404</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-5xl font-bold uppercase tracking-tight">
          Viatura não encontrada
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-400">
          Este detalhe pode ainda não estar publicado no catálogo. Volte ao stock para explorar as
          restantes unidades.
        </p>
        <Link
          href="/stock"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-sm bg-white px-6 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-zinc-200"
        >
          Voltar ao stock
        </Link>
      </div>
    </section>
  );
}
