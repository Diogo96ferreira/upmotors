import Link from "next/link";
import { company } from "@/lib/site";

const items = [
  { href: "/backoffice", label: "Dashboard" },
  { href: "/backoffice/cars", label: "Viaturas" },
  { href: "/backoffice/leads", label: "Leads" },
];

export function BackofficeShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-shell py-12 pt-32">
      <div className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
            {company.name} Backoffice Demo
          </p>
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-tight">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-400">{description}</p>
          </div>
        </div>

        <div className="border border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-zinc-400">
          Modo demo
        </div>
      </div>

      <div className="mb-10 flex flex-wrap gap-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border border-white/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-300 transition hover:border-white/30 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {children}
    </section>
  );
}
