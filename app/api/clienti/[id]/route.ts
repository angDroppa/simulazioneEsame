import { requireAuth } from '@/lib/auth-helper'
import prisma from '@/lib/prisma'
import { UpdateClienteSchema } from '@/lib/schemas/consegna.schema'
import { NextResponse } from 'next/server'

type Params = Promise<{ id: string }>

export async function GET(req: Request, { params }: { params: Params }) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { id } = await params

  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(id) },
    include: { consegne: true },
  })

  if (!cliente) return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404 })
  return NextResponse.json(cliente)
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { id } = await params

  const body = await req.json()
  const parsed = UpdateClienteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 })
  }

  const cliente = await prisma.cliente.update({
    where: { id: Number(id) },
    data: parsed.data,
  })

  return NextResponse.json(cliente)
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { id } = await params

  await prisma.cliente.delete({ where: { id: Number(id) } })
  return new NextResponse(null, { status: 204 })
}