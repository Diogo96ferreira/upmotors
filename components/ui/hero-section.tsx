import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  highlights?: string[];
  primaryAction?: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
  align?: "left" | "bottom";
  compact?: boolean;
};

export function HeroSection({
  eyebrow,
  title,
  description,
  image,
  highlights,
  primaryAction,
  secondaryAction,
  align = "left",
  compact = false,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative flex overflow-hidden",
        compact ? "min-h-[65svh] pt-24" : "min-h-[92svh] pt-24"
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        priority={!compact}
        sizes="100vw"
        className="absolute inset-0 object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      <div
        className={cn(
          "container-shell relative z-10 flex w-full",
          align === "bottom" ? "items-end pb-16 md:pb-24" : "items-center"
        )}
      >
        <div
          className={cn(
            "grid w-full gap-10"
          )}
        >
          <div className="max-w-4xl space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-zinc-400">
              {eyebrow}
            </p>
            <h1 className="text-balance font-[family-name:var(--font-heading)] text-5xl font-bold uppercase leading-none tracking-tight md:text-7xl">
              {title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-zinc-300">{description}</p>

            {highlights?.length ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="border border-white/12 bg-black/35 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-200 backdrop-blur-sm"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            ) : null}

            {(primaryAction || secondaryAction) && (
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                {primaryAction ? (
                  <Link href={primaryAction.href} className={cn(buttonVariants({ size: "lg" }))}>
                    {primaryAction.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : null}
                {secondaryAction ? (
                  <Link
                    href={secondaryAction.href}
                    className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
                  >
                    {secondaryAction.label}
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
