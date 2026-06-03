import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { UpdateConsegnaSchema } from '@/lib/schemas/consegna.schema'
import { requireAuth } from '@/lib/auth-helper'

type Params = Promise<{ id: string }>

export async function GET(req: Request, { params }: { params: Params }) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { id } = await params

  const consegna = await prisma.consegna.findUnique({
    where: { id: Number(id) },
    include: { cliente: true, stato: true, operatore: true },
  })

  if (!consegna) return NextResponse.json({ error: 'Consegna non trovata' }, { status: 404 })
  return NextResponse.json(consegna)
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { id } = await params

  const body = await req.json()
  const parsed = UpdateConsegnaSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.consegna.findUnique({
    where: { id: Number(id) },
    include: { stato: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Consegna non trovata' }, { status: 404 })
  }

  const dataRitiro = parsed.data.dataRitiro ?? existing.dataRitiro
  const dataConsegna = parsed.data.dataConsegna ?? existing.dataConsegna

  if (dataConsegna && dataConsegna < dataRitiro) {
    return NextResponse.json(
      { error: 'La data di consegna non può essere precedente alla data di ritiro' },
      { status: 400 }
    )
  }

  const isConsegnata = existing.stato.descrizione.toLowerCase() === 'consegnata'
  if (isConsegnata && !parsed.data.dataConsegna) {
    return NextResponse.json(
      { error: 'Una consegna consegnata deve avere una data di consegna' },
      { status: 400 }
    )
  }

  const { clienteId, operatoreId, statoId, ...rest } = parsed.data

  const consegna = await prisma.consegna.update({
    where: { id: Number(id) },
    data: {
      ...rest,
      ...(clienteId && { cliente: { connect: { id: clienteId } } }),
      ...(operatoreId && { operatore: { connect: { id: operatoreId } } }),
      ...(statoId && { stato: { connect: { id: statoId } } }),
    },
    include: { cliente: true, stato: true, operatore: true },
  })

  return NextResponse.json(consegna)
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { id } = await params

  const existing = await prisma.consegna.findUnique({
    where: { id: Number(id) },
    include: { stato: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Consegna non trovata' }, { status: 404 })
  }

  if (existing.stato.descrizione.toLowerCase() === 'consegnata') {
    return NextResponse.json(
      { error: 'Una consegna già consegnata non può essere eliminata' },
      { status: 409 }
    )
  }

  await prisma.consegna.delete({ where: { id: Number(id) } })
  return new NextResponse(null, { status: 204 })
}