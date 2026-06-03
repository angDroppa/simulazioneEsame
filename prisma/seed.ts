// prisma/seed.ts

import { PrismaClient, Prisma } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    options: '-c search_path=tracking',
})
pool.on('connect', (client) => {
    client.query('SET search_path TO tracking')
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    await prisma.role.createMany({
        data: [{ role: 'ADMIN' }, { role: 'OPERATORE' }],
        skipDuplicates: true,
    })

    await prisma.statoConsegna.createMany({
        data: [
            { descrizione: 'Da ritirare' },
            { descrizione: 'In deposito' },
            { descrizione: 'In consegna' },
            { descrizione: 'Consegnata' },
            { descrizione: 'In giacenza' },
        ],
        skipDuplicates: true,
    })

    const stati = await prisma.statoConsegna.findMany()
    const s = (desc: string) => stati.find((s) => s.descrizione === desc)!.id

    const password = await bcrypt.hash('password123', 10)

    const operatoriData: Prisma.UserCreateInput[] = [
        {
            firstName: 'Mario',
            lastName: 'Rossi',
            email: 'mario.rossi@corriere.it',
            password,
            role: { connect: { role: 'OPERATORE' } },
        },
        {
            firstName: 'Giulia',
            lastName: 'Bianchi',
            email: 'giulia.bianchi@corriere.it',
            password,
            role: { connect: { role: 'OPERATORE' } },
        },
        {
            firstName: 'Admin',
            lastName: 'Sistema',
            email: 'admin@corriere.it',
            password,
            role: { connect: { role: 'ADMIN' } },
        },
    ]

    const operatori: Awaited<ReturnType<typeof prisma.user.create>>[] = []
    for (const u of operatoriData) {
        const op = await prisma.user.upsert({
            where: { email: u.email as string },
            update: {},
            create: u,
        })
        operatori.push(op)
    }

    const [mario, giulia] = operatori

    const clientiData: Prisma.ClienteCreateInput[] = [
        {
            nominativo: 'Luca Ferri',
            via: 'Via Garibaldi 12',
            comune: 'Milano',
            paese: 'Italia',
            telefono: '3331234567',
            email: 'luca.ferri@email.it',
        },
        {
            nominativo: 'Anna Conti',
            via: 'Corso Italia 45',
            comune: 'Roma',
            paese: 'Italia',
            telefono: '3479876543',
            email: 'anna.conti@email.it',
        },
        {
            nominativo: 'Marco Esposito',
            via: 'Via Roma 8',
            comune: 'Napoli',
            paese: 'Italia',
            telefono: '3201122334',
            email: 'marco.esposito@email.it',
        },
        {
            nominativo: 'Sara Greco',
            via: 'Via Manzoni 3',
            comune: 'Torino',
            paese: 'Italia',
            telefono: '3456789012',
        },
        {
            nominativo: 'Paolo Ricci',
            via: 'Via Dante 22',
            comune: 'Bologna',
            paese: 'Italia',
            email: 'paolo.ricci@email.it',
            note: 'Consegnare solo al mattino',
        },
    ]

    const clienti: Awaited<ReturnType<typeof prisma.cliente.create>>[] = []
    for (const c of clientiData) {
        const cliente = await prisma.cliente.create({ data: c })
        clienti.push(cliente)
    }

    const consegneData: Prisma.ConsegnaCreateInput[] = [
        {
            chiaveConsegna: 'TRK-2026-000001',
            dataRitiro: new Date('2026-05-01'),
            dataConsegna: new Date('2026-05-03'),
            cliente: { connect: { id: clienti[0].id } },
            operatore: { connect: { id: mario.id } },
            stato: { connect: { id: s('Consegnata') } },
        },
        {
            chiaveConsegna: 'TRK-2026-000002',
            dataRitiro: new Date('2026-05-05'),
            dataConsegna: new Date('2026-05-08'),
            cliente: { connect: { id: clienti[1].id } },
            operatore: { connect: { id: giulia.id } },
            stato: { connect: { id: s('Consegnata') } },
        },
        {
            chiaveConsegna: 'TRK-2026-000003',
            dataRitiro: new Date('2026-05-10'),
            dataConsegna: new Date('2026-05-14'),
            cliente: { connect: { id: clienti[2].id } },
            operatore: { connect: { id: mario.id } },
            stato: { connect: { id: s('Consegnata') } },
        },
        {
            chiaveConsegna: 'TRK-2026-000004',
            dataRitiro: new Date('2026-05-20'),
            dataConsegna: new Date('2026-05-22'),
            cliente: { connect: { id: clienti[0].id } },
            operatore: { connect: { id: giulia.id } },
            stato: { connect: { id: s('In consegna') } },
        },
        {
            chiaveConsegna: 'TRK-2026-000005',
            dataRitiro: new Date('2026-05-22'),
            dataConsegna: new Date('2026-05-25'),
            cliente: { connect: { id: clienti[3].id } },
            operatore: { connect: { id: mario.id } },
            stato: { connect: { id: s('In deposito') } },
        },
        {
            chiaveConsegna: 'TRK-2026-000006',
            dataRitiro: new Date('2026-05-25'),
            dataConsegna: new Date('2026-05-28'),
            cliente: { connect: { id: clienti[4].id } },
            operatore: { connect: { id: giulia.id } },
            stato: { connect: { id: s('Da ritirare') } },
        },
        {
            chiaveConsegna: 'TRK-2026-000007',
            dataRitiro: new Date('2026-05-26'),
            dataConsegna: new Date('2026-05-29'),
            cliente: { connect: { id: clienti[1].id } },
            operatore: { connect: { id: mario.id } },
            stato: { connect: { id: s('In giacenza') } },
        },
        {
            chiaveConsegna: 'TRK-2026-000008',
            dataRitiro: new Date('2026-05-27'),
            dataConsegna: new Date('2026-05-30'),
            cliente: { connect: { id: clienti[2].id } },
            operatore: { connect: { id: giulia.id } },
            stato: { connect: { id: s('Da ritirare') } },
        },
    ]

    for (const c of consegneData) {
        await prisma.consegna.create({ data: c })
    }

    console.log('Seed completato.')
    console.log('Credenziali di test:')
    console.log('  mario.rossi@corriere.it    / password123')
    console.log('  giulia.bianchi@corriere.it / password123')
    console.log('  admin@corriere.it          / password123')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })