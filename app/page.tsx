// app/page.tsx

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="card bg-base-100 w-full max-w-2xl shadow-sm">
        <div className="card-body gap-6">

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">
              Gestione Consegne
            </h1>

            <p className="text-base-content/70">
              Sistema per la gestione delle spedizioni e il tracking pubblico
              delle consegne.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="card bg-base-200">
              <div className="card-body gap-4">
                <div>
                  <h2 className="card-title">Area Operatore</h2>

                  <p className="text-sm text-base-content/70">
                    Accedi per gestire clienti, consegne e statistiche.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link href="/login" className="btn btn-primary flex-1">
                    Accedi
                  </Link>

                  <Link href="/register" className="btn btn-outline flex-1">
                    Registrati
                  </Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body gap-4">
                <div>
                  <h2 className="card-title">Tracking Pubblico</h2>

                  <p className="text-sm text-base-content/70">
                    Controlla lo stato di una spedizione tramite tracking.
                  </p>
                </div>

                <Link href="/tracking" className="btn btn-secondary">
                  Vai al tracking
                </Link>
              </div>
            </div>

          </div>

          <div className="divider my-0" />

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-box bg-base-200 p-4">
              <p className="font-medium">Gestione Clienti</p>

              <p className="text-sm text-base-content/70">
                Visualizza, crea e modifica i clienti.
              </p>
            </div>

            <div className="rounded-box bg-base-200 p-4">
              <p className="font-medium">Consegne</p>

              <p className="text-sm text-base-content/70">
                Aggiorna stato, tracking e date di consegna.
              </p>
            </div>

            <div className="rounded-box bg-base-200 p-4">
              <p className="font-medium">Statistiche</p>

              <p className="text-sm text-base-content/70">
                Consulta riepiloghi e tempi medi di consegna.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}