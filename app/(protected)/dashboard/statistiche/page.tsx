'use client'

import { useEffect, useState } from 'react'
import { statisticheApi, StatisticheResponse } from '@/lib/axios/statistiche'

const STATI = [
  { id: '', label: 'Tutti gli stati' },
  { id: '1', label: 'Da ritirare' },
  { id: '2', label: 'In deposito' },
  { id: '3', label: 'In consegna' },
  { id: '4', label: 'Consegnata' },
  { id: '5', label: 'In giacenza' },
]

function formatTempo(ore: number | null): string {
  if (ore === null) return '—'
  if (ore < 24) return `${ore}h`
  const giorni = Math.round((ore / 24) * 10) / 10
  return `${giorni} giorni`
}

function getDefaultDates() {
  const today = new Date()
  const yearAgo = new Date()
  yearAgo.setFullYear(today.getFullYear() - 1)
  return {
    dal: yearAgo.toISOString().split('T')[0],
    al: today.toISOString().split('T')[0],
  }
}

const defaults = getDefaultDates()

export default function StatistichePage() {
  const [dal, setDal] = useState(defaults.dal)
  const [al, setAl] = useState(defaults.al)
  const [statoId, setStatoId] = useState<string>('')

  const [data, setData] = useState<StatisticheResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!dal || !al) return

    let active = true

    statisticheApi
      .get({ dal, al, statoId: statoId ? Number(statoId) : undefined })
      .then((res) => { if (active) setData(res) })
      .catch(() => { if (active) setError('Errore nel caricamento dei dati.') })

    return () => { active = false }
  }, [dal, al, statoId])

  const reload = () => {
    if (!dal || !al) return
    setError(null)
    statisticheApi
      .get({ dal, al, statoId: statoId ? Number(statoId) : undefined })
      .then((res) => setData(res))
      .catch(() => setError('Errore nel caricamento dei dati.'))
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Statistiche consegne</h1>
        <p className="text-sm text-base-content/60">Analisi andamento spedizioni</p>
      </div>

      {/* FILTRI */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="form-control">
          <label className="label"><span className="label-text">Dal</span></label>
          <input
            type="date"
            className="input input-bordered"
            value={dal}
            onChange={(e) => setDal(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Al</span></label>
          <input
            type="date"
            className="input input-bordered"
            value={al}
            onChange={(e) => setAl(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Stato</span></label>
          <select
            className="select select-bordered"
            value={statoId}
            onChange={(e) => setStatoId(e.target.value)}
          >
            {STATI.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary" onClick={reload}>
          Aggiorna
        </button>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Totale consegne</p>
            <p className="text-4xl font-bold">{data?.numeroConsegne ?? '—'}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Tempo medio consegna</p>
            <p className="text-4xl font-bold">
              {formatTempo(data?.tempoMedioConsegnaOre ?? null)}
            </p>
            <p className="text-xs text-base-content/40">Solo consegne concluse</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Periodo</p>
            <p className="text-sm font-medium">
              {dal && al
                ? `${new Date(dal).toLocaleDateString('it-IT')} → ${new Date(al).toLocaleDateString('it-IT')}`
                : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* TABELLA PER STATO */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title text-base mb-2">Riepilogo per stato</h2>

          {!data?.perStato?.length ? (
            <p className="text-sm text-base-content/60">Nessun dato disponibile</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Stato</th>
                    <th className="text-right">Numero consegne</th>
                    <th className="text-right">% sul totale</th>
                    <th>Distribuzione</th>
                  </tr>
                </thead>
                <tbody>
                  {data.perStato.map((s) => {
                    const pct = data.numeroConsegne
                      ? Math.round((s.count / data.numeroConsegne) * 100)
                      : 0
                    return (
                      <tr key={s.statoId}>
                        <td>{s.descrizione}</td>
                        <td className="text-right font-mono">{s.count}</td>
                        <td className="text-right font-mono">{pct}%</td>
                        <td className="w-48">
                          <progress
                            className="progress progress-primary w-full"
                            value={s.count}
                            max={data.numeroConsegne || 1}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="font-bold">Totale</td>
                    <td className="text-right font-bold font-mono">{data.numeroConsegne}</td>
                    <td className="text-right font-mono">100%</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}