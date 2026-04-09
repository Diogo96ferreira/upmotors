import { BackofficeShell } from "@/components/backoffice/backoffice-shell";
import { CarForm } from "@/components/backoffice/car-form";

export default function NewCarPage() {
  return (
    <BackofficeShell
      title="Nova Viatura"
      description="Cria uma nova viatura para alimentar o catalogo publico."
    >
      <CarForm />
    </BackofficeShell>
  );
}
