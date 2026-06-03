"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth.store";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-6 space-y-6">

      <div className="space-y-1">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-base-content/70">
          Benvenuto {user?.firstName || user?.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Link
          href="/dashboard/clienti"
          className="card bg-base-100 shadow-sm hover:shadow-md transition"
        >
          <div className="card-body">
            <h2 className="card-title">
              Clienti
            </h2>

            <p className="text-sm text-base-content/70">
              Visualizza, crea e modifica i clienti.
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/consegne"
          className="card bg-base-100 shadow-sm hover:shadow-md transition"
        >
          <div className="card-body">
            <h2 className="card-title">
              Consegne
            </h2>

            <p className="text-sm text-base-content/70">
              Gestisci spedizioni e stati delle consegne.
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/statistiche"
          className="card bg-base-100 shadow-sm hover:shadow-md transition"
        >
          <div className="card-body">
            <h2 className="card-title">
              Statistiche
            </h2>

            <p className="text-sm text-base-content/70">
              Consulta riepiloghi e tempi medi di consegna.
            </p>
          </div>
        </Link>

        <Link
          href="/tracking"
          className="card bg-base-100 shadow-sm hover:shadow-md transition"
        >
          <div className="card-body">
            <h2 className="card-title">
              Tracking pubblico
            </h2>

            <p className="text-sm text-base-content/70">
              Verifica lo stato di una spedizione.
            </p>
          </div>
        </Link>

      </div>

      
    </div>
  );
}