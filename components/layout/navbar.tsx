"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, CarFront, UserRound } from "lucide-react";
import { company, navItems } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/65 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-6">
        <Link href="/" className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-[0.24em]">
          {company.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b pb-1 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500",
                  active ? "border-white text-white" : "border-transparent hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 text-zinc-300 md:flex">
            <CarFront className="h-4 w-4" />
            <UserRound className="h-4 w-4" />
          </div>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition hover:scale-[1.01] hover:bg-zinc-200"
          >
            <CalendarDays className="h-4 w-4" />
            Marcar reunião
          </Link>
        </div>
      </div>
    </header>
  );
}
