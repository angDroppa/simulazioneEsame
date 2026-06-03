// app/tracking/page.tsx

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { trackingApi, type TrackingResponse } from '@/lib/axios/tracking'

type TrackingForm = {
  chiaveConsegna: string
  dataRitiro: string
}

export default function TrackingPage() {
  const [result, setResult] = useState<TrackingResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingForm>()

  const onSubmit = async (data: TrackingForm) => {
    setIsLoading(true)
    setNotFound(false)
    setResult(null)

    try {
      const response = await trackingApi.track(data)
      setResult(response)
    } catch {
      setNotFound(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="card bg-base-100 w-full max-w-md shadow-sm">
        <div className="card-body gap-4">

          <div>
            <h1 className="card-title text-2xl">
              Tracking Consegna
            </h1>

            <p className="text-sm text-base-content/70">
              Inserisci chiave tracking e data di ritiro.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Chiave tracking
              </legend>

              <input
                type="text"
                placeholder="TRK-2026-000001"
                className={`input w-full ${
                  errors.chiaveConsegna ? 'input-error' : ''
                }`}
                {...register('chiaveConsegna', {
                  required: 'Campo obbligatorio',
                })}
              />

              {errors.chiaveConsegna && (
                <p className="fieldset-label text-error">
                  {errors.chiaveConsegna.message}
                </p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Data ritiro
              </legend>

              <input
                type="date"
                className={`input w-full ${
                  errors.dataRitiro ? 'input-error' : ''
                }`}
                {...register('dataRitiro', {
                  required: 'Campo obbligatorio',
                })}
              />

              {errors.dataRitiro && (
                <p className="fieldset-label text-error">
                  {errors.dataRitiro.message}
                </p>
              )}
            </fieldset>

            <button
              type="submit"
              className="btn btn-primary mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                'Cerca spedizione'
              )}
            </button>
          </form>

          {notFound && (
            <div className="alert alert-error">
              <span>Consegna non trovata.</span>
            </div>
          )}

          {result && (
            <div className="card bg-base-200 mt-2">
              <div className="card-body gap-2">

                <h2 className="card-title text-lg">
                  Stato spedizione
                </h2>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">
                    Stato
                  </span>

                  <div className="badge badge-primary">
                    {result.stato.descrizione}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">
                    Data ritiro
                  </span>

                  <span>
                    {new Date(result.dataRitiro).toLocaleDateString('it-IT')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">
                    Data consegna
                  </span>

                  <span>
                    {result.dataConsegna
                      ? new Date(result.dataConsegna).toLocaleDateString('it-IT')
                      : '-'}
                  </span>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}