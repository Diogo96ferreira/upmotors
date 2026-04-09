import { mockCars } from "@/app/backoffice/mock-data";
import { BackofficeShell } from "@/components/backoffice/backoffice-shell";
import { CarForm } from "@/components/backoffice/car-form";

export default function NewCarPage() {
  return (
    <BackofficeShell
      title="Nova Viatura"
      description="Formulario visual hardcoded para apresentar a area de criacao."
    >
      <CarForm car={mockCars[0]} />
    </BackofficeShell>
  );
}
