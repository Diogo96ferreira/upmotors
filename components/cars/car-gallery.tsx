"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CarGalleryProps = {
  images: string[];
  altBase: string;
};

export function CarGallery({ images, altBase }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const featuredImage = images[0];
  const additionalImages = images.slice(1);
  const currentImage = images[activeIndex];

  useEffect(() => {
    setMounted(true);
  }, []);

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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length, lightboxOpen]);

  const lightbox = useMemo(() => {
    if (!mounted || !lightboxOpen) {
      return null;
    }

    return createPortal(
      <AnimatePresence>
        <motion.div
          key={`lightbox-${currentImage}`}
          className="fixed inset-0 z-[120] flex h-screen w-screen items-center justify-center bg-black/88 p-4 backdrop-blur-md md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute inset-0 cursor-default"
            aria-label="Fechar galeria"
          />

          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition hover:bg-white/10 md:right-8 md:top-8"
            aria-label="Fechar galeria"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 ? (
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current - 1 + images.length) % images.length)
              }
              className="absolute left-3 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition hover:bg-white/10 md:left-8"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : null}

          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-5">
            <div className="flex min-h-[60svh] items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={currentImage}
                  alt={`${altBase} ampliada ${activeIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.985, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.01, y: -10 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="max-h-[78svh] w-full object-contain"
                />
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">
                {activeIndex + 1} / {images.length}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={`${image}-thumb`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "overflow-hidden border transition",
                      index === activeIndex
                        ? "border-white/50"
                        : "border-white/10 hover:border-white/25"
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

          {images.length > 1 ? (
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current + 1) % images.length)}
              className="absolute right-3 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition hover:bg-white/10 md:right-8"
              aria-label="Imagem seguinte"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : null}
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  }, [activeIndex, altBase, currentImage, images, lightboxOpen, mounted]);

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
          onClick={() => {
            setActiveIndex(0);
            setLightboxOpen(true);
          }}
          className="block w-full overflow-hidden border border-white/8 bg-zinc-950 text-left"
        >
          <img
            src={featuredImage}
            alt={`${altBase} vista principal`}
            className="aspect-[16/10] h-full w-full object-cover transition duration-700"
          />
        </button>

        {additionalImages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {additionalImages.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => {
                  setActiveIndex(index + 1);
                  setLightboxOpen(true);
                }}
                className={cn(
                  "overflow-hidden border bg-zinc-950 text-left transition",
                  activeIndex === index + 1
                    ? "border-white/40"
                    : "border-white/8 hover:border-white/20"
                )}
              >
                <img
                  src={image}
                  alt={`${altBase} galeria ${index + 2}`}
                  className="aspect-[16/10] h-full w-full object-cover transition duration-700"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {lightbox}
    </>
  );
}
