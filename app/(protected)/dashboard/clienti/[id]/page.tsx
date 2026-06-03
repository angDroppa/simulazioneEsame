'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { clientiApi } from '@/lib/axios/clienti'
import { Cliente } from '@/lib/schemas/consegna.schema'

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs opacity-50 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium">{value || '—'}</span>
    </div>
  )
}

export default function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let active = true

    clientiApi.getById(Number(id))
      .then((c) => { if (active) setCliente(c) })
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

  if (!cliente) {
    return (
      <div className="p-6">
        <p>Cliente non trovato.</p>
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
        <h1 className="text-2xl font-bold">{cliente.nominativo}</h1>
      </div>

      {/* ANAGRAFICA */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title text-base">Anagrafica</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nominativo" value={cliente.nominativo} />
            <Field label="Telefono"   value={cliente.telefono} />
            <Field label="Email"      value={cliente.email} />
            <Field label="Via"        value={cliente.via} />
            <Field label="Comune"     value={cliente.comune} />
            <Field label="Paese"      value={cliente.paese} />
          </div>

          {cliente.note && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs opacity-50 uppercase tracking-wide">Note</span>
              <p className="text-sm">{cliente.note}</p>
            </div>
          )}

          <Field
            label="Cliente dal"
            value={new Date(cliente.createdAt).toLocaleDateString('it-IT', {
              day: '2-digit', month: 'long', year: 'numeric',
            })}
          />
        </div>
      </div>

    </div>
  )
}