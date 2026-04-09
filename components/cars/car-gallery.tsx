"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CarGalleryProps = {
  images: string[];
  altBase: string;
};

export function CarGallery({ images, altBase }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current + 1) % images.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current - 1 + images.length) % images.length);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length, lightboxOpen]);

  const currentImage = images[activeIndex];

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Galeria</p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold uppercase tracking-tight">
              Perspetivas da viatura
            </h2>
          </div>
          <p className="text-sm text-zinc-500">{images.length} imagens</p>
        </div>

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block w-full overflow-hidden border border-white/8 bg-zinc-950 text-left"
        >
          <img
            src={currentImage}
            alt={`${altBase} vista principal`}
            className="aspect-[16/10] h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
          />
        </button>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                setLightboxOpen(true);
              }}
              className={cn(
                "overflow-hidden border bg-zinc-950 text-left transition",
                index === activeIndex ? "border-white/40" : "border-white/8 hover:border-white/20"
              )}
            >
              <img
                src={image}
                alt={`${altBase} galeria ${index + 1}`}
                className="aspect-[16/10] h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white transition hover:bg-white/10 md:right-8 md:top-8"
            aria-label="Fechar galeria"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveIndex((current) => (current - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/15 text-white transition hover:bg-white/10 md:left-8"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
            <img
              src={currentImage}
              alt={`${altBase} ampliada ${activeIndex + 1}`}
              className="max-h-[78svh] w-full object-contain"
            />
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">
                {activeIndex + 1} / {images.length}
              </p>
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={`${image}-thumb`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "overflow-hidden border transition",
                      index === activeIndex ? "border-white/40" : "border-white/10"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${altBase} miniatura ${index + 1}`}
                      className="h-16 w-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveIndex((current) => (current + 1) % images.length)}
            className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/15 text-white transition hover:bg-white/10 md:right-8"
            aria-label="Imagem seguinte"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </>
  );
}
