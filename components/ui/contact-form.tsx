"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { submitLeadSubmission, type LeadSubmissionState } from "@/app/actions/lead-submission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";

const initialLeadSubmissionState: LeadSubmissionState = {
  status: "idle",
  message: "",
};

type ContactFormProps = {
  title: string;
  subtitle: string;
  cta: string;
  fields?: "contact" | "sell" | "import";
};

export function ContactForm({
  title,
  subtitle,
  cta,
  fields = "contact",
}: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const handledStateRef = useRef("");
  const { toast } = useToast();
  const [state, formAction] = useActionState(submitLeadSubmission, initialLeadSubmissionState);

  useEffect(() => {
    const stateKey = `${state.status}|${state.message}`;

    if (state.status === "idle" || handledStateRef.current === stateKey) {
      return;
    }

    handledStateRef.current = stateKey;

    if (state.status === "success") {
      formRef.current?.reset();
      toast({
        title: "Mensagem enviada",
        description: state.message,
        variant: "success",
      });
      return;
    }

    if (state.status === "error") {
      toast({
        title: "Nao foi possivel enviar",
        description: state.message,
        variant: "error",
      });
    }
  }, [state.message, state.status, toast]);

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
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid gap-8 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Nome</span>
            <Input name="name" placeholder="O seu nome" minLength={2} required />
          </label>
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Email</span>
            <Input name="email" placeholder="atelier@empresa.pt" required type="email" />
          </label>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Telefone</span>
            <Input name="phone" placeholder="+351 9XX XXX XXX" inputMode="tel" />
          </label>

          {fields === "sell" || fields === "import" ? (
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Marca</span>
              <Input name="brand" placeholder="Ex: Mercedes-Benz" required />
            </label>
          ) : (
            <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-zinc-400">
              Quanto mais contexto nos deres, mais depressa e melhor a equipa te consegue
              responder.
            </div>
          )}
        </div>

        {fields === "sell" ? (
          <>
            <div className="grid gap-8 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Modelo</span>
                <Input name="model" placeholder="Ex: 911 Carrera S" required />
              </label>
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Ano</span>
                <Input name="year" placeholder="2023" required inputMode="numeric" />
              </label>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  Quilometragem
                </span>
                <Input name="mileage_km" placeholder="12000" required inputMode="numeric" />
              </label>
              <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-zinc-400">
                Inclui estado geral, manutencao recente, historico e extras relevantes para uma
                avaliacao mais precisa.
              </div>
            </div>
          </>
        ) : null}

        {fields === "import" ? (
          <>
            <div className="grid gap-8 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Modelo</span>
                <Input name="model" placeholder="Ex: E 220 d Estate" required />
              </label>
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  Ano pretendido
                </span>
                <Input name="year" placeholder="Ex: 2021" inputMode="numeric" />
              </label>
            </div>
            <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-zinc-400">
              Explica na mensagem a motorizacao, orcamento, quilometragem maxima, caixa, cor ou
              qualquer configuracao importante para o pedido de importacao.
            </div>
          </>
        ) : null}

        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Mensagem</span>
          <Textarea
            name="message"
            minLength={12}
            placeholder={
              fields === "sell"
                ? "Estado da viatura, manutencao, extras relevantes, urgencia da venda..."
                : fields === "import"
                  ? "Indica a viatura pretendida, versao, motorizacao, orcamento, prazo ideal e detalhes importantes para a importacao."
                  : "Diga-nos o modelo, viatura ou servico que pretende e como prefere ser contactado."
            }
            required
          />
        </label>

        <div className="space-y-4 pt-2">
          <SubmitButton cta={cta} />
          <p className="text-xs leading-6 text-zinc-500">
            Ao enviar, os teus dados ficam registados no sistema interno da Up Motors para
            acompanhamento do pedido.
          </p>
        </div>
      </form>
    </div>
  );
}

function SubmitButton({ cta }: { cta: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "A enviar..." : cta}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
}
