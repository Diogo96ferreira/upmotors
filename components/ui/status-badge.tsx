import { CarStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const statusMap: Record<CarStatus, { label: string; className: string }> = {
  available: {
    label: "Disponivel",
    className:
      "border-emerald-300/70 bg-emerald-950/85 text-emerald-100 shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
  },
  reserved: {
    label: "Reservado",
    className:
      "border-amber-300/70 bg-amber-950/85 text-amber-100 shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
  },
  sold: {
    label: "Vendido",
    className:
      "border-zinc-200/55 bg-black/85 text-zinc-100 shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
  },
  draft: {
    label: "Rascunho",
    className:
      "border-sky-300/70 bg-sky-950/85 text-sky-100 shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
  },
};

export function StatusBadge({ status }: { status: CarStatus }) {
  const config = statusMap[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] backdrop-blur-sm",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
