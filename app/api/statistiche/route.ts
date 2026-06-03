// app/api/statistiche/route.ts

import { requireAuth } from '@/lib/auth-helper'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const StatisticheQuerySchema = z.object({
  dal: z.coerce.date(),
  al: z.coerce.date(),
  statoId: z.coerce.number().int().optional(),
})

export async function GET(req: Request) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { searchParams } = new URL(req.url)

  const parsed = StatisticheQuerySchema.safeParse({
    dal: searchParams.get('dal'),
    al: searchParams.get('al'),
    statoId: searchParams.get('statoId') ?? undefined,
  })

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 })
  }

  const { dal, al, statoId } = parsed.data

  if (al < dal) {
    return NextResponse.json(
      { error: 'La data "al" non può essere precedente alla data "dal"' },
      { status: 400 }
    )
  }

  const where = {
    dataRitiro: {
      gte: dal,
      lte: al,
    },
    ...(statoId && { statoId }),
  }

  const consegne = await prisma.consegna.findMany({
    where,
    include: { stato: true },
  })

  const numeroConsegne = consegne.length

  const consegneConcluse = consegne.filter(
    (c) => c.stato.descrizione.toLowerCase() === 'consegnata'
  )

  let tempoMedioConsegnaOre: number | null = null

  if (consegneConcluse.length > 0) {
    const totaleOre = consegneConcluse.reduce((acc, c) => {
      const diffMs = c.dataConsegna.getTime() - c.dataRitiro.getTime()
      const diffOre = diffMs / (1000 * 60 * 60)
      return acc + diffOre
    }, 0)

    tempoMedioConsegnaOre = Math.round((totaleOre / consegneConcluse.length) * 10) / 10
  }

  const perStato = await prisma.consegna.groupBy({
    by: ['statoId'],
    where,
    _count: { id: true },
  })

  const statiIds = perStato.map((s) => s.statoId)
  const statiLabels = await prisma.statoConsegna.findMany({
    where: { id: { in: statiIds } },
  })

  const riepilogoPerStato = perStato.map((s) => ({
    statoId: s.statoId,
    descrizione: statiLabels.find((l) => l.id === s.statoId)?.descrizione ?? '',
    count: s._count.id,
  }))

  return NextResponse.json({
    dal,
    al,
    numeroConsegne,
    tempoMedioConsegnaOre,
    perStato: riepilogoPerStato,
  })
}