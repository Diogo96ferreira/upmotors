import { updateLeadStatus } from "@/app/backoffice/actions/admin";
import { BackofficeShell } from "@/components/backoffice/backoffice-shell";
import { Select } from "@/components/ui/select";
import { getLeadSubmissions } from "@/lib/backoffice-data";
import { requireBackofficeUser } from "@/lib/backoffice-session";

const leadStatuses = ["new", "contacted", "closed"] as const;

export default async function BackofficeLeadsPage() {
  await requireBackofficeUser();
  const leads = await getLeadSubmissions();

  return (
    <BackofficeShell
      title="Leads"
      description="Consulta os pedidos recebidos e atualiza o estado de acompanhamento."
    >
      <div className="space-y-5">
        {leads.map((lead) => (
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

              <form action={updateLeadStatus} className="w-full max-w-xs space-y-3">
                <input type="hidden" name="id" value={lead.id} />
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">Estado do lead</p>
                <Select name="status" defaultValue={lead.status}>
                  {leadStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
                <button
                  type="submit"
                  className="h-10 w-full border border-white/15 px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  Atualizar
                </button>
              </form>
            </div>
          </article>
        ))}

        {leads.length === 0 ? (
          <div className="border border-white/10 bg-zinc-950 p-8 text-sm text-zinc-400">
            Ainda nao existem leads registados.
          </div>
        ) : null}
      </div>
    </BackofficeShell>
  );
}
