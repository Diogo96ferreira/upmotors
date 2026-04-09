"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  title: string;
  subtitle: string;
  cta: string;
  fields?: "contact" | "sell";
};

export function ContactForm({
  title,
  subtitle,
  cta,
  fields = "contact",
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="border border-white/10 bg-zinc-950/90 p-8 md:p-10">
      <div className="mb-10 space-y-3">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
          {title}
        </h2>
        <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">{subtitle}</p>
      </div>

      <form
        className="space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="grid gap-8 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Nome</span>
            <Input placeholder="O seu nome" required />
          </label>
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Email</span>
            <Input placeholder="atelier@empresa.pt" required type="email" />
          </label>
        </div>

        {fields === "sell" ? (
          <>
            <div className="grid gap-8 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Marca</span>
                <Input placeholder="Ex: Porsche" required />
              </label>
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Modelo</span>
                <Input placeholder="Ex: 911 Carrera S" required />
              </label>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Ano</span>
                <Input placeholder="2023" required />
              </label>
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  Quilometragem
                </span>
                <Input placeholder="12 000 km" required />
              </label>
            </div>
          </>
        ) : (
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Telefone</span>
            <Input placeholder="+351 9XX XXX XXX" />
          </label>
        )}

        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Mensagem</span>
          <Textarea
            placeholder={
              fields === "sell"
                ? "Estado da viatura, manutenção, extras relevantes..."
                : "Diga-nos o modelo ou serviço que pretende."
            }
            required
          />
        </label>

        <div className="space-y-4 pt-2">
          <Button type="submit" className="w-full">
            {cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {submitted ? (
            <p className="text-sm text-zinc-400">
              Pedido registado. Esta área está pronta para ser ligada a Supabase ou CRM.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
