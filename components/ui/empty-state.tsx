import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: {
    href?: string;
    label: string;
    onClick?: () => void;
  };
};

export function EmptyState({ eyebrow, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[20rem] flex-col items-center justify-center border border-dashed border-white/15 bg-zinc-950/70 px-6 py-12 text-center">
      <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">{eyebrow}</p>
      <h3 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold uppercase tracking-tight">
        {title}
      </h3>
      <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-400">{description}</p>
      {action?.href ? (
        <Link href={action.href} className={cn(buttonVariants(), "mt-8")}>
          {action.label}
        </Link>
      ) : action?.onClick ? (
        <button type="button" onClick={action.onClick} className={cn(buttonVariants(), "mt-8")}>
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
