import { BackofficeShell } from "@/components/backoffice/backoffice-shell";
import { CarForm } from "@/components/backoffice/car-form";
import { requireBackofficeUser } from "@/lib/backoffice-session";

export default async function NewCarPage() {
  await requireBackofficeUser();

  return (
    <BackofficeShell
      title="Nova Viatura"
      description="Cria uma nova viatura para alimentar o catalogo publico."
    >
      <CarForm />
    </BackofficeShell>
  );
}
