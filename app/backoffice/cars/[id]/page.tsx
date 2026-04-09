import { notFound } from "next/navigation";
import { mockCars } from "@/app/backoffice/mock-data";
import { BackofficeShell } from "@/components/backoffice/backoffice-shell";
import { CarForm } from "@/components/backoffice/car-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCarPage({ params }: Props) {
  const { id } = await params;
  const car = mockCars.find((item) => item.id === id);

  if (!car) {
    notFound();
  }

  return (
    <BackofficeShell
      title={`${car.brand} ${car.model}`}
      description="Edicao visual da viatura em modo demo."
    >
      <CarForm car={car} />
    </BackofficeShell>
  );
}
