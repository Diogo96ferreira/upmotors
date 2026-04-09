import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { cn } from "@/lib/utils";

type CTASectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
};

export function CTASection({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}: CTASectionProps) {
  return (
    <SectionWrapper className="pt-8">
      <div className="relative overflow-hidden border border-white/10 bg-zinc-950 px-8 py-10 md:px-12 md:py-14">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-zinc-400">
              {eyebrow}
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase tracking-tight md:text-5xl">
              {title}
            </h2>
            <p className="text-lg leading-8 text-zinc-300">{description}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href={primaryAction.href} className={cn(buttonVariants())}>
                {primaryAction.label}
                <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
