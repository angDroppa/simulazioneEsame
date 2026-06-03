// app/api/tracking/route.ts

import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const chiave = searchParams.get('chiave')
  const dataRitiro = searchParams.get('dataRitiro')

  if (!chiave && !dataRitiro) {
    return NextResponse.json({ error: 'Parametro mancante' }, { status: 400 })
  }

  const consegna = await prisma.consegna.findFirst({
    where: {
      ...(chiave && { chiaveConsegna: chiave }),
      ...(dataRitiro && { dataRitiro: new Date(dataRitiro) }),
    },
    select: {
      chiaveConsegna: true,
      dataRitiro: true,
      dataConsegna: true,
      stato: true,
      cliente: {
        select: { nominativo: true, comune: true },
      },
    },
  })

  if (!consegna) {
    return NextResponse.json({ error: 'Consegna non trovata' }, { status: 404 })
  }

  return NextResponse.json(consegna)
}