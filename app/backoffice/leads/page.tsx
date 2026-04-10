import { BackofficeShell } from "@/components/backoffice/backoffice-shell";
import { LeadsManager } from "@/components/backoffice/leads-manager";
import { getLeadSubmissions } from "@/lib/backoffice-data";
import { requireBackofficeUser } from "@/lib/backoffice-session";

export default async function BackofficeLeadsPage() {
  await requireBackofficeUser();
  const leads = await getLeadSubmissions();

  return (
    <BackofficeShell
      title="Leads"
      description="Consulta os pedidos recebidos e atualiza o estado de acompanhamento."
    >
      <LeadsManager leads={leads} />
    </BackofficeShell>
  );
}
