// app/api/clienti/route.ts

import { requireAuth } from '@/lib/auth-helper'
import prisma from '@/lib/prisma'
import { CreateClienteSchema } from '@/lib/schemas/consegna.schema'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const clienti = await prisma.cliente.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(clienti)
}

export async function POST(req: Request) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const body = await req.json()
  const parsed = CreateClienteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 })
  }

  const cliente = await prisma.cliente.create({ data: parsed.data })
  return NextResponse.json(cliente, { status: 201 })
}