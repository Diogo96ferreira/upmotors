"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import {
  initialLeadSubmissionState,
  submitLeadSubmission,
} from "@/app/actions/lead-submission";
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
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(submitLeadSubmission, initialLeadSubmissionState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <div className="border border-white/10 bg-zinc-950/90 p-8 md:p-10">
      <div className="mb-10 space-y-3">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
          {title}
        </h2>
        <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">{subtitle}</p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-8">
        <input type="hidden" name="formType" value={fields} />

        <div className="grid gap-8 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Nome</span>
            <Input name="name" placeholder="O seu nome" required />
          </label>
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Email</span>
            <Input name="email" placeholder="atelier@empresa.pt" required type="email" />
          </label>
        </div>

        {fields === "sell" ? (
          <>
            <div className="grid gap-8 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Marca</span>
                <Input name="brand" placeholder="Ex: Porsche" required />
              </label>
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Modelo</span>
                <Input name="model" placeholder="Ex: 911 Carrera S" required />
              </label>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Ano</span>
                <Input name="year" placeholder="2023" required inputMode="numeric" />
              </label>
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  Quilometragem
                </span>
                <Input name="mileage_km" placeholder="12000" required inputMode="numeric" />
              </label>
            </div>
          </>
        ) : (
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Telefone</span>
            <Input name="phone" placeholder="+351 9XX XXX XXX" />
          </label>
        )}

        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Mensagem</span>
          <Textarea
            name="message"
            placeholder={
              fields === "sell"
                ? "Estado da viatura, manutenção, extras relevantes..."
                : "Diga-nos o modelo ou serviço que pretende."
            }
            required
          />
        </label>

        <div className="space-y-4 pt-2">
          <SubmitButton cta={cta} />
          {state.message ? (
            <p className={state.status === "error" ? "text-sm text-rose-300" : "text-sm text-zinc-400"}>
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}

function SubmitButton({ cta }: { cta: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "A enviar" : cta}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
}
