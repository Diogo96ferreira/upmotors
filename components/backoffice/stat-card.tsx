export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="border border-white/10 bg-zinc-950 p-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">{label}</p>
      <p className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight">
        {value}
      </p>
      <p className="mt-3 text-sm text-zinc-400">{hint}</p>
    </div>
  );
}
