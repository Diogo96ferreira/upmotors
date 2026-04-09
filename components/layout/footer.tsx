import Link from "next/link";
import { company } from "@/lib/site";

const links = [
  { href: "/contact", label: "Privacidade" },
  { href: "/contact", label: "Termos" },
  { href: "/contact", label: "Cookies" },
  { href: "/contact", label: "Livro de Reclamações" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80">
      <div className="container-shell flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-[0.24em]">
            {company.name}
          </p>
          <p className="max-w-sm text-sm text-zinc-500">
            Curadoria automóvel premium, avaliação especializada e acompanhamento próximo em
            Coimbra.
          </p>
        </div>

        <div className="space-y-5 md:text-right">
          <div className="flex flex-wrap gap-5 text-[11px] uppercase tracking-[0.24em] text-zinc-500 md:justify-end">
            {links.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            © 2026 {company.name} • {company.tagline} • {company.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
