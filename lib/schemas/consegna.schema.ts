import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

// ─── StatoConsegna ───────────────────────────────────────────────

export const StatoConsegnaSchema = z.object({
  id: z.number().int(),
  descrizione: z.string(),
})

export type StatoConsegna = z.infer<typeof StatoConsegnaSchema>

// ─── Cliente ─────────────────────────────────────────────────────

export const ClienteSchema = z.object({
  id: z.number().int(),
  nominativo: z.string().min(1),
  via: z.string().min(1),
  comune: z.string().min(1),
  paese: z.string().min(1),
  telefono: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  note: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
})

export const CreateClienteSchema = ClienteSchema.omit({ id: true, createdAt: true })
export const UpdateClienteSchema = CreateClienteSchema.partial()

export type Cliente = z.infer<typeof ClienteSchema>
export type CreateCliente = z.infer<typeof CreateClienteSchema>
export type UpdateCliente = z.infer<typeof UpdateClienteSchema>

// ─── Operatore (subset di User) ──────────────────────────────────

export const OperatoreSchema = z.object({
  id: z.number().int(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
})

export type Operatore = z.infer<typeof OperatoreSchema>

// ─── Consegna ────────────────────────────────────────────────────

export const ConsegnaSchema = z.object({
  id: z.number().int(),
  chiaveConsegna: z.string(),
  dataRitiro: z.coerce.date(),
  dataConsegna: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date(),
  clienteId: z.number().int(),
  operatoreId: z.number().int(),
  statoId: z.number().int(),
  // relazioni incluse dall'API
  cliente: ClienteSchema.optional(),
  stato: StatoConsegnaSchema.optional(),
  operatore: OperatoreSchema.optional(),
})

export const CreateConsegnaSchema = z.object({
  dataRitiro: z.coerce.date(),
  dataConsegna: z.coerce.date(),
  clienteId: z.number().int(),
  operatoreId: z.number().int(),
  statoId: z.number().int(),
})

export const UpdateConsegnaSchema = z.object({
  dataRitiro: z.coerce.date().optional(),
  dataConsegna: z.coerce.date().optional(),
  clienteId: z.number().int().optional(),
  operatoreId: z.number().int().optional(),
  statoId: z.number().int().optional(),
}).refine(
  (data) => {
    if (data.dataRitiro && data.dataConsegna) {
      return data.dataConsegna >= data.dataRitiro
    }
    return true
  },
  { message: 'La data di consegna non può essere precedente alla data di ritiro', path: ['dataConsegna'] }
)

export const UpdateStatoSchema = z.object({
  statoId: z.number().int(),
})

export type Consegna = z.infer<typeof ConsegnaSchema>
export type CreateConsegna = z.infer<typeof CreateConsegnaSchema>
export type UpdateConsegna = z.infer<typeof UpdateConsegnaSchema>
export type UpdateStato = z.infer<typeof UpdateStatoSchema>