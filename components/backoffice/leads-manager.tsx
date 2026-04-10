"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquareReply, Phone, Search } from "lucide-react";
import {
  type ActionResult,
  sendLeadReply,
  updateLeadStatus,
} from "@/app/backoffice/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import { getLeadStatusLabel } from "@/lib/labels";
import { LeadSubmissionRow, LeadStatus } from "@/types/database";

const leadStatuses = ["new", "contacted", "closed"] as const;
const formTypes = ["all", "contact", "sell"] as const;

function getLeadFormTypeLabel(formType: LeadSubmissionRow["form_type"]) {
  return formType === "sell" ? "Venda" : "Contacto";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function normalizePhone(phone?: string | null) {
  if (!phone) {
    return "";
  }

  return phone.replace(/[^\d+]/g, "");
}

function buildLeadEmailBody(lead: LeadSubmissionRow, draftReply: string) {
  const greeting = `Ola ${lead.name},`;
  const closing = "\n\nCumprimentos,\nEquipa Up Motors";
  return `${greeting}\n\n${draftReply}${closing}`;
}

export function LeadsManager({ leads }: { leads: LeadSubmissionRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [formTypeFilter, setFormTypeFilter] = useState<(typeof formTypes)[number]>("all");
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replySubjects, setReplySubjects] = useState<Record<string, string>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" ? true : lead.status === statusFilter;
      const matchesFormType = formTypeFilter === "all" ? true : lead.form_type === formTypeFilter;
      const haystack = [
        lead.name,
        lead.email,
        lead.phone ?? "",
        lead.brand ?? "",
        lead.model ?? "",
        lead.message,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = normalizedSearch ? haystack.includes(normalizedSearch) : true;

      return matchesStatus && matchesFormType && matchesSearch;
    });
  }, [formTypeFilter, leads, search, statusFilter]);

  async function runLeadAction(key: string, action: () => Promise<ActionResult>) {
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
    <div className="space-y-6">
      <section className="grid gap-4 border border-white/10 bg-zinc-950 p-6 lg:grid-cols-[1.4fr_220px_220px]">
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Pesquisa</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome, email, telefone, marca, modelo ou mensagem"
              className="pl-7"
            />
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Tipo</span>
          <Select
            value={formTypeFilter}
            onChange={(event) => setFormTypeFilter(event.target.value as (typeof formTypes)[number])}
          >
            {formTypes.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "Todos" : item === "sell" ? "Venda" : "Contacto"}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Estado</span>
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as LeadStatus | "all")}
          >
            <option value="all">Todos</option>
            {leadStatuses.map((status) => (
              <option key={status} value={status}>
                {getLeadStatusLabel(status)}
              </option>
            ))}
          </Select>
        </label>
      </section>

      <div className="space-y-5">
        {filteredLeads.map((lead) => {
          const replySubject =
            replySubjects[lead.id] ??
            `Resposta Up Motors - ${
              lead.brand && lead.model ? `${lead.brand} ${lead.model}` : "seguimento ao seu pedido"
            }`;
          const replyDraft =
            replyDrafts[lead.id] ??
            "Obrigado pelo seu contacto. Partilhamos abaixo o seguimento ao seu pedido:";

          return (
            <article key={lead.id} className="border border-white/10 bg-zinc-950 p-6">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
                      {lead.name}
                    </h2>
                    <span className="border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
                      {getLeadFormTypeLabel(lead.form_type)}
                    </span>
                    <span className="border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
                      {getLeadStatusLabel(lead.status)}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                      {formatDate(lead.created_at)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-zinc-400">
                    <p>{lead.email}</p>
                    {lead.phone ? <p>{lead.phone}</p> : null}
                  </div>

                  {lead.brand || lead.model ? (
                    <p className="text-sm text-zinc-300">
                      Viatura: {[lead.brand, lead.model, lead.year].filter(Boolean).join(" ")}
                      {lead.mileage_km ? ` | ${lead.mileage_km.toLocaleString("pt-PT")} km` : ""}
                    </p>
                  ) : null}

                  <p className="max-w-3xl text-sm leading-7 text-zinc-300">{lead.message}</p>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex h-10 items-center justify-center border border-white/15 px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white/40 hover:bg-white/5"
                    >
                      Email direto
                    </a>
                    {lead.phone ? (
                      <>
                        <a
                          href={`tel:${normalizePhone(lead.phone)}`}
                          className="inline-flex h-10 items-center justify-center border border-white/15 px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white/40 hover:bg-white/5"
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Ligar
                        </a>
                        <a
                          href={`https://wa.me/${normalizePhone(lead.phone).replace(/^\+/, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-10 items-center justify-center border border-white/15 px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white/40 hover:bg-white/5"
                        >
                          WhatsApp
                        </a>
                      </>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setOpenReplyId(openReplyId === lead.id ? null : lead.id)}
                      className="inline-flex h-10 items-center justify-center border border-white/15 px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white/40 hover:bg-white/5"
                    >
                      <MessageSquareReply className="mr-2 h-4 w-4" />
                      Responder
                    </button>
                  </div>

                  {openReplyId === lead.id ? (
                    <div className="space-y-4 border border-white/10 bg-black/20 p-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2">
                          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                            Assunto
                          </span>
                          <Input
                            value={replySubject}
                            onChange={(event) =>
                              setReplySubjects((current) => ({
                                ...current,
                                [lead.id]: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <div className="rounded-sm border border-white/10 bg-zinc-950/50 px-4 py-3 text-sm leading-6 text-zinc-400">
                          Esta resposta envia diretamente do backoffice quando o Resend estiver
                          configurado. Em alternativa, podes continuar a abrir o email preparado.
                        </div>
                      </div>

                      <label className="space-y-2">
                        <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                          Texto da resposta
                        </span>
                        <Textarea
                          value={replyDraft}
                          onChange={(event) =>
                            setReplyDrafts((current) => ({
                              ...current,
                              [lead.id]: event.target.value,
                            }))
                          }
                          className="min-h-36"
                        />
                      </label>

                      <div className="flex flex-wrap gap-3">
                        <form
                          action={async (formData) => {
                            await runLeadAction(`reply-${lead.id}`, () => sendLeadReply(formData));
                          }}
                        >
                          <input type="hidden" name="leadId" value={lead.id} />
                          <input type="hidden" name="to" value={lead.email} />
                          <input type="hidden" name="subject" value={replySubject} />
                          <input type="hidden" name="message" value={replyDraft} />
                          <Button type="submit" disabled={busyKey === `reply-${lead.id}`}>
                            {busyKey === `reply-${lead.id}` ? "A enviar..." : "Enviar do backoffice"}
                          </Button>
                        </form>

                        <a
                          href={`mailto:${lead.email}?subject=${encodeURIComponent(
                            replySubject
                          )}&body=${encodeURIComponent(buildLeadEmailBody(lead, replyDraft))}`}
                          className="inline-flex h-12 items-center justify-center border border-white/15 px-6 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white/40 hover:bg-white/5"
                        >
                          Abrir email preparado
                        </a>

                        <button
                          type="button"
                          onClick={async () => {
                            await navigator.clipboard.writeText(buildLeadEmailBody(lead, replyDraft));
                            toast({
                              title: "Resposta copiada",
                              description: "O texto da resposta foi copiado para a area de transferencia.",
                              variant: "success",
                            });
                          }}
                          className="inline-flex h-12 items-center justify-center border border-white/15 px-6 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white/40 hover:bg-white/5"
                        >
                          Copiar texto
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                <form
                  action={async (formData) => {
                    await runLeadAction(`status-${lead.id}`, () => updateLeadStatus(formData));
                  }}
                  className="w-full max-w-xs space-y-3"
                >
                  <input type="hidden" name="id" value={lead.id} />
                  <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                    Estado do lead
                  </p>
                  <Select name="status" defaultValue={lead.status}>
                    {leadStatuses.map((status) => (
                      <option key={status} value={status}>
                        {getLeadStatusLabel(status)}
                      </option>
                    ))}
                  </Select>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={busyKey === `status-${lead.id}`}
                    className="w-full"
                  >
                    {busyKey === `status-${lead.id}` ? "A atualizar..." : "Atualizar"}
                  </Button>
                </form>
              </div>
            </article>
          );
        })}

        {filteredLeads.length === 0 ? (
          <div className="border border-white/10 bg-zinc-950 p-8 text-sm text-zinc-400">
            Nenhum lead corresponde aos filtros atuais.
          </div>
        ) : null}
      </div>
    </div>
  );
}
