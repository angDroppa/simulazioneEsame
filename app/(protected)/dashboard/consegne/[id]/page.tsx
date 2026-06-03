'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { consegneApi } from '@/lib/axios/consegne'
import { Consegna } from '@/lib/schemas/consegna.schema'

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs opacity-50 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium">{value || '—'}</span>
    </div>
  )
}

function StatoBadge({ descrizione }: { descrizione?: string }) {
  const colorMap: Record<string, string> = {
    'Da ritirare': 'badge-warning',
    'In deposito': 'badge-info',
    'In consegna': 'badge-primary',
    'Consegnata':  'badge-success',
    'In giacenza': 'badge-error',
  }
  const cls = colorMap[descrizione ?? ''] ?? 'badge-ghost'
  return <span className={`badge ${cls} badge-md`}>{descrizione ?? '—'}</span>
}

export default function ConsegnaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [consegna, setConsegna] = useState<Consegna | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let active = true

    consegneApi.getById(Number(id))
      .then((c) => { if (active) setConsegna(c) })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [id])

  if (loading) {
    return (
      <div className="p-6">
        <span className="loading loading-spinner loading-md" />
      </div>
    )
  }

  if (!consegna) {
    return (
      <div className="p-6">
        <p>Consegna non trovata.</p>
        <button className="btn btn-ghost mt-2" onClick={() => router.back()}>
          ← Torna indietro
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">

      {/* BACK + HEADER */}
      <div className="flex items-center gap-4">
        <button className="btn btn-ghost btn-sm" onClick={() => router.back()}>
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold font-mono">{consegna.chiaveConsegna}</h1>
          <div className="mt-1">
            <StatoBadge descrizione={consegna.stato?.descrizione} />
          </div>
        </div>
      </div>

      {/* DETTAGLIO CONSEGNA */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title text-base">Dettaglio</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Data ritiro"
              value={new Date(consegna.dataRitiro).toLocaleDateString('it-IT', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            />
            <Field
              label="Data consegna"
              value={consegna.dataConsegna
                ? new Date(consegna.dataConsegna).toLocaleDateString('it-IT', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })
                : null}
            />
            <Field
              label="Creata il"
              value={new Date(consegna.createdAt).toLocaleDateString('it-IT', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            />
          </div>
        </div>
      </div>

      {/* CLIENTE */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title text-base">Cliente</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nominativo" value={consegna.cliente?.nominativo} />
            <Field label="Via"        value={consegna.cliente?.via} />
            <Field label="Comune"     value={consegna.cliente?.comune} />
            <Field label="Paese"      value={consegna.cliente?.paese} />
            <Field label="Telefono"   value={consegna.cliente?.telefono} />
            <Field label="Email"      value={consegna.cliente?.email} />
          </div>
        </div>
      </div>

      {/* OPERATORE */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title text-base">Operatore</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Nome"
              value={consegna.operatore
                ? `${consegna.operatore.firstName} ${consegna.operatore.lastName}`
                : undefined}
            />
            <Field label="Email" value={consegna.operatore?.email} />
          </div>
        </div>
      </div>

    </div>
  )
}