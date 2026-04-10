"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type ActionResult,
  deleteCarImage,
  reorderCarImages,
  setFeaturedCarImage,
  updateCarImageAltText,
} from "@/app/backoffice/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";
import { CarImageRow } from "@/types/database";

function sortImages(images: CarImageRow[]) {
  return [...images].sort((a, b) => (a.position ?? 9999) - (b.position ?? 9999));
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

export function CarImageManager({
  carId,
  carSlug,
  carLabel,
  images,
}: {
  carId: string;
  carSlug: string;
  carLabel: string;
  images: CarImageRow[];
}) {
  const sortedImages = useMemo(() => sortImages(images), [images]);
  const featuredImage = sortedImages.find((image) => image.is_feature) ?? sortedImages[0] ?? null;
  const initialGalleryImages = useMemo(
    () => sortedImages.filter((image) => image.id !== featuredImage?.id),
    [featuredImage?.id, sortedImages]
  );

  const [galleryImages, setGalleryImages] = useState(initialGalleryImages);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [dragOverImageId, setDragOverImageId] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setGalleryImages(initialGalleryImages);
  }, [initialGalleryImages]);

  const orderChanged =
    galleryImages.map((image) => image.id).join("|") !==
    initialGalleryImages.map((image) => image.id).join("|");

  function handleDrop(targetImageId: string) {
    if (!draggedImageId || draggedImageId === targetImageId) {
      setDraggedImageId(null);
      setDragOverImageId(null);
      return;
    }

    const fromIndex = galleryImages.findIndex((image) => image.id === draggedImageId);
    const toIndex = galleryImages.findIndex((image) => image.id === targetImageId);

    if (fromIndex === -1 || toIndex === -1) {
      setDraggedImageId(null);
      setDragOverImageId(null);
      return;
    }

    setGalleryImages((currentImages) => moveItem(currentImages, fromIndex, toIndex));
    setDraggedImageId(null);
    setDragOverImageId(null);
  }

  async function runAction(key: string, action: () => Promise<ActionResult>) {
    setBusyKey(key);
    const result = await action();
    setBusyKey(null);

    if (result.error) {
      toast({
        title: "Operacao falhou",
        description: result.error,
        variant: "error",
      });
      return;
    }

    if (result.success) {
      toast({
        title: "Operacao concluida",
        description: result.success,
        variant: "success",
      });
    }

    router.refresh();
  }

  return (
    <section className="space-y-8 border border-white/10 bg-zinc-950 p-8">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Media</p>
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase tracking-tight">
            Gerir imagens
          </h2>
          <p className="mt-3 max-w-3xl text-zinc-400">
            Escolhe a imagem principal, ajusta a ordem da galeria por drag and drop, atualiza o
            texto alternativo e remove imagens que ja nao facam parte da viatura.
          </p>
        </div>
      </div>

      {featuredImage ? (
        <div className="space-y-4 border border-white/10 bg-black/20 p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Imagem principal</p>
          <img
            src={featuredImage.url}
            alt={featuredImage.alt_text ?? carLabel}
            className="h-72 w-full object-cover"
          />

          <form
            action={async (formData) => {
              await runAction("feature-alt", () => updateCarImageAltText(formData));
            }}
            className="space-y-4"
          >
            <input type="hidden" name="carId" value={carId} />
            <input type="hidden" name="carSlug" value={carSlug} />
            <input type="hidden" name="imageId" value={featuredImage.id} />
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                Alt text da principal
              </span>
              <Input name="altText" defaultValue={featuredImage.alt_text ?? ""} />
            </label>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="outline" size="sm">
                {busyKey === "feature-alt" ? "A guardar..." : "Guardar alt text"}
              </Button>
            </div>
          </form>

          <form
            action={async (formData) => {
              await runAction("feature-delete", () => deleteCarImage(formData));
            }}
          >
            <input type="hidden" name="carId" value={carId} />
            <input type="hidden" name="carSlug" value={carSlug} />
            <input type="hidden" name="imageId" value={featuredImage.id} />
            <input type="hidden" name="storagePath" value={featuredImage.storage_path ?? ""} />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={busyKey === "feature-delete"}
              className="text-rose-300 hover:text-rose-200"
            >
              {busyKey === "feature-delete" ? "A apagar..." : "Apagar imagem"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="border border-white/10 bg-black/20 p-5 text-sm text-zinc-400">
          Ainda nao existe imagem principal para esta viatura.
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Galeria</p>
            <p className="mt-2 text-sm text-zinc-400">
              Arrasta os thumbnails para definir a ordem. Depois guarda a nova posicao.
            </p>
          </div>

          {galleryImages.length > 1 ? (
            <form
              action={async (formData) => {
                await runAction("reorder-gallery", () => reorderCarImages(formData));
              }}
              className="flex items-center gap-3"
            >
              <input type="hidden" name="carId" value={carId} />
              <input type="hidden" name="carSlug" value={carSlug} />
              {galleryImages.map((image) => (
                <input key={image.id} type="hidden" name="imageOrder" value={image.id} />
              ))}
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={!orderChanged || busyKey === "reorder-gallery"}
              >
                {busyKey === "reorder-gallery" ? "A guardar..." : "Guardar ordem"}
              </Button>
            </form>
          ) : null}
        </div>

        {galleryImages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => setDraggedImageId(image.id)}
                onDragEnd={() => {
                  setDraggedImageId(null);
                  setDragOverImageId(null);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverImageId(image.id);
                }}
                onDragLeave={() => {
                  if (dragOverImageId === image.id) {
                    setDragOverImageId(null);
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDrop(image.id);
                }}
                className={cn(
                  "space-y-4 border border-white/10 bg-black/20 p-4 transition",
                  draggedImageId === image.id && "opacity-50",
                  dragOverImageId === image.id && "border-white/40 bg-white/5"
                )}
              >
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  <span>Arrastar</span>
                  <span>#{galleryImages.findIndex((galleryImage) => galleryImage.id === image.id) + 1}</span>
                </div>

                <img
                  src={image.url}
                  alt={image.alt_text ?? `${carLabel} galeria`}
                  className="aspect-[4/3] w-full object-cover"
                />

                <div className="flex flex-wrap gap-3">
                  <form
                    action={async (formData) => {
                      await runAction(`feature-${image.id}`, () => setFeaturedCarImage(formData));
                    }}
                  >
                    <input type="hidden" name="carId" value={carId} />
                    <input type="hidden" name="carSlug" value={carSlug} />
                    <input type="hidden" name="imageId" value={image.id} />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      disabled={busyKey === `feature-${image.id}`}
                    >
                      {busyKey === `feature-${image.id}` ? "A atualizar..." : "Tornar principal"}
                    </Button>
                  </form>

                  <form
                    action={async (formData) => {
                      await runAction(`delete-${image.id}`, () => deleteCarImage(formData));
                    }}
                  >
                    <input type="hidden" name="carId" value={carId} />
                    <input type="hidden" name="carSlug" value={carSlug} />
                    <input type="hidden" name="imageId" value={image.id} />
                    <input type="hidden" name="storagePath" value={image.storage_path ?? ""} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      disabled={busyKey === `delete-${image.id}`}
                      className="text-rose-300 hover:text-rose-200"
                    >
                      {busyKey === `delete-${image.id}` ? "A apagar..." : "Apagar"}
                    </Button>
                  </form>
                </div>

                <form
                  action={async (formData) => {
                    await runAction(`alt-${image.id}`, () => updateCarImageAltText(formData));
                  }}
                  className="space-y-3"
                >
                  <input type="hidden" name="carId" value={carId} />
                  <input type="hidden" name="carSlug" value={carSlug} />
                  <input type="hidden" name="imageId" value={image.id} />
                  <label className="space-y-2">
                    <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                      Alt text
                    </span>
                    <Input name="altText" defaultValue={image.alt_text ?? ""} />
                  </label>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={busyKey === `alt-${image.id}`}
                  >
                    {busyKey === `alt-${image.id}` ? "A guardar..." : "Guardar alt text"}
                  </Button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-white/10 bg-black/20 p-5 text-sm text-zinc-400">
            Ainda nao existem imagens adicionais na galeria.
          </div>
        )}
      </div>
    </section>
  );
}
