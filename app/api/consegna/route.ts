import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { CreateConsegnaSchema } from '@/lib/schemas/consegna.schema'
import { requireAuth } from '@/lib/auth-helper'

export async function GET(req: Request) {
    const user = await requireAuth(req)
    if (!user) {
        return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const consegne = await prisma.consegna.findMany({
        orderBy: { createdAt: 'desc' },
        include: { cliente: true, stato: true, operatore: true },
    })

    return NextResponse.json(consegne)
}

export async function POST(req: Request) {
    const user = await requireAuth(req)
    if (!user) {
        return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = CreateConsegnaSchema.safeParse(body)

    if (!parsed.success) {
        return NextResponse.json(
            { errors: parsed.error.flatten() },
            { status: 400 }
        )
    }

    const { clienteId, operatoreId, statoId, dataRitiro, dataConsegna } = parsed.data

    const consegna = await prisma.consegna.create({
        data: {
            dataRitiro,
            dataConsegna, // 👈 FIX FONDAMENTALE
            cliente: { connect: { id: clienteId } },
            operatore: { connect: { id: operatoreId } },
            stato: { connect: { id: statoId } },
        },
        include: { cliente: true, stato: true, operatore: true },
    })

    return NextResponse.json(consegna, { status: 201 })
}