import { CarStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const statusMap: Record<CarStatus, { label: string; className: string }> = {
  available: {
    label: "Disponível",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  },
  reserved: {
    label: "Reservado",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  },
  sold: {
    label: "Vendido",
    className: "border-zinc-400/20 bg-zinc-400/10 text-zinc-200",
  },
  draft: {
    label: "Rascunho",
    className: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  },
};

export function StatusBadge({ status }: { status: CarStatus }) {
  const config = statusMap[status];

  return (
    <span
      className={cn(
        "inline-flex items-center border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em]",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
