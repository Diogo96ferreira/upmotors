import { notFound } from "next/navigation";
import { BackofficeShell } from "@/components/backoffice/backoffice-shell";
import { CarForm } from "@/components/backoffice/car-form";
import { getAdminCarById } from "@/lib/backoffice-data";
import { requireBackofficeUser } from "@/lib/backoffice-session";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCarPage({ params }: Props) {
  await requireBackofficeUser();

  const { id } = await params;
  const car = await getAdminCarById(id);

  if (!car) {
    notFound();
  }

  return (
    <BackofficeShell
      title={`${car.brand} ${car.model}`}
      description="Edita os dados da viatura que alimentam catalogo, detalhe e destaques."
    >
      <CarForm car={car} />
    </BackofficeShell>
  );
}
