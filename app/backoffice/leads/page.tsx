import { mockLeads } from "@/app/backoffice/mock-data";
import { BackofficeShell } from "@/components/backoffice/backoffice-shell";
import { Select } from "@/components/ui/select";

const leadStatuses = ["new", "contacted", "closed"] as const;

export default function BackofficeLeadsPage() {
  return (
    <BackofficeShell
      title="Leads"
      description="Vista demo dos pedidos recebidos, sem ligacao ao backend."
    >
      <div className="space-y-5">
        {mockLeads.map((lead) => (
          <article key={lead.id} className="border border-white/10 bg-zinc-950 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                    {lead.name}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    {lead.form_type} | {lead.email}
                    {lead.phone ? ` | ${lead.phone}` : ""}
                  </p>
                </div>

                {lead.brand || lead.model ? (
                  <p className="text-sm text-zinc-300">
                    Viatura: {[lead.brand, lead.model, lead.year].filter(Boolean).join(" ")}
                    {lead.mileage_km ? ` | ${lead.mileage_km.toLocaleString("pt-PT")} km` : ""}
                  </p>
                ) : null}

                <p className="max-w-3xl text-sm leading-7 text-zinc-300">{lead.message}</p>
              </div>

              <div className="w-full max-w-xs space-y-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">Estado do lead</p>
                <Select defaultValue={lead.status} disabled>
                  {leadStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
                <button
                  type="button"
                  className="h-10 w-full border border-white/15 px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  Atualizar visual
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </BackofficeShell>
  );
}
