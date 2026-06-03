"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import Modal, { ModalHandle } from "@/app/components/modal";
import { consegneApi } from "@/lib/axios/consegne";
import { clientiApi } from "@/lib/axios/clienti";
import { useAuthStore } from "@/lib/store/auth.store";
import { Cliente } from "@/lib/schemas/consegna.schema";

// ─── schema form ─────────────────────────────────────────────────
const CreateConsegnaFormSchema = z
  .object({
    clienteId: z.coerce
      .number({ error: "Seleziona un cliente" })   // ← error, non invalid_type_error
      .int()
      .min(1, "Seleziona un cliente"),
    statoId: z.coerce
      .number({ error: "Seleziona uno stato" })    // ← error, non invalid_type_error
      .int()
      .min(1, "Seleziona uno stato"),
    dataRitiro: z.string().min(1, "Inserisci la data di ritiro"),
    dataConsegna: z.string().min(1, "Inserisci la data di consegna"),
  })
  .refine(
    (data) => {
      if (data.dataRitiro && data.dataConsegna) {
        return new Date(data.dataConsegna) >= new Date(data.dataRitiro);
      }
      return true;
    },
    {
      message:
        "La data di consegna non può essere precedente alla data di ritiro",
      path: ["dataConsegna"],
    },
  );

type FormInput  = z.input<typeof CreateConsegnaFormSchema>;   // ← aggiunto
type FormValues = z.output<typeof CreateConsegnaFormSchema>;  // ← era z.infer

// ─── tipi locali ─────────────────────────────────────────────────
type Consegna = {
  id: number;
  chiaveConsegna: string;
  cliente?: { nominativo: string };
  stato?: { descrizione: string };
};

const stati = [
  { id: 1, label: "Da ritirare" },
  { id: 2, label: "In deposito" },
  { id: 3, label: "In consegna" },
  { id: 4, label: "Consegnata" },
  { id: 5, label: "In giacenza" },
];

export default function ConsegnePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const modalRef = useRef<ModalHandle>(null);

  const [consegne, setConsegne] = useState<Consegna[]>([]);
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({   // ← tre generici
    resolver: zodResolver(CreateConsegnaFormSchema),
  });

  useEffect(() => {
    if (!user) return;
    let active = true;

    Promise.all([consegneApi.getAll(), clientiApi.getAll()])
      .then(([c, cl]) => {
        if (!active) return;
        setConsegne(c);
        setClienti(cl);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="p-6">
        <p>Sessione non valida</p>
        <button
          className="btn btn-primary mt-2"
          onClick={() => router.push("/login")}
        >
          Vai al login
        </button>
      </div>
    );
  }

  const reload = () =>
    Promise.all([consegneApi.getAll(), clientiApi.getAll()]).then(([c, cl]) => {
      setConsegne(c);
      setClienti(cl);
    });

  const onSubmit = async (data: FormValues) => {
    await consegneApi.create({
      clienteId: data.clienteId,
      statoId: data.statoId,
      operatoreId: user.id,
      dataRitiro: new Date(data.dataRitiro),
      dataConsegna: new Date(data.dataConsegna),
    });
    reset();
    modalRef.current?.close();
    await reload();
  };

  const changeStato = async (id: number, statoId: number) => {
    await consegneApi.updateStato(id, statoId);
    await reload();
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Consegne</h1>
        <button
          className="btn btn-primary"
          onClick={() => modalRef.current?.open()}
        >
          Nuova consegna
        </button>
      </div>

      {/* MODAL */}
      <Modal ref={modalRef} title="Nuova consegna">
        <form onSubmit={(e) => handleSubmit(onSubmit)(e)} className="space-y-4">
          {/* CLIENTE */}
          <div className="space-y-1">
            <select
              className={`select select-bordered w-full ${errors.clienteId ? "select-error" : ""}`}
              {...register("clienteId")}
            >
              <option value="">Cliente *</option>
              {clienti.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nominativo}
                </option>
              ))}
            </select>
            {errors.clienteId && (
              <p className="text-error text-xs">{errors.clienteId.message}</p>
            )}
          </div>

          {/* STATO */}
          <div className="space-y-1">
            <select
              className={`select select-bordered w-full ${errors.statoId ? "select-error" : ""}`}
              {...register("statoId")}
            >
              <option value="">Stato *</option>
              {stati.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.statoId && (
              <p className="text-error text-xs">{errors.statoId.message}</p>
            )}
          </div>

          {/* DATE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm opacity-70">Data ritiro *</label>
              <input
                type="date"
                className={`input input-bordered w-full ${errors.dataRitiro ? "input-error" : ""}`}
                {...register("dataRitiro")}
              />
              {errors.dataRitiro && (
                <p className="text-error text-xs">
                  {errors.dataRitiro.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm opacity-70">Data consegna *</label>
              <input
                type="date"
                className={`input input-bordered w-full ${errors.dataConsegna ? "input-error" : ""}`}
                {...register("dataConsegna")}
              />
              {errors.dataConsegna && (
                <p className="text-error text-xs">
                  {errors.dataConsegna.message}
                </p>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                reset();
                modalRef.current?.close();
              }}
            >
              Annulla
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvataggio..." : "Crea consegna"}
            </button>
          </div>
        </form>
      </Modal>

      {/* LISTA */}
      <div className="space-y-2">
        {loading && <p>Caricamento...</p>}

        {consegne.map((c) => (
          <div
            key={c.id}
            className="p-4 border rounded bg-base-100 cursor-pointer hover:bg-base-200 transition-colors"
            onClick={() => router.push(`/dashboard/consegne/${c.id}`)}
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{c.chiaveConsegna}</p>
                <p className="text-sm opacity-70">
                  Cliente: {c.cliente?.nominativo}
                </p>
              </div>
              <div className="text-sm">Stato: {c.stato?.descrizione}</div>
            </div>

            <div className="mt-2 flex gap-2 flex-wrap">
              {stati.map((s) => (
                <button
                  key={s.id}
                  className="btn btn-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    changeStato(c.id, s.id);
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}