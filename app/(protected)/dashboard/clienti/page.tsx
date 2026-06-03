'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Modal, { ModalHandle } from '@/app/components/modal'
import { clientiApi } from '@/lib/axios/clienti'
import { Cliente, CreateClienteSchema } from '@/lib/schemas/consegna.schema'
import { GeocodingResult } from '@/lib/schemas/geocoding.schema'
import { AddressInput } from '@/app/components/addreddInput'
import { z } from 'zod'

type FormValues = z.infer<typeof CreateClienteSchema>

export default function ClientiPage() {
  const router = useRouter()
  const modalRef = useRef<ModalHandle>(null)

  const [clienti, setClienti] = useState<Cliente[]>([])
  const [editId, setEditId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(CreateClienteSchema),
    defaultValues: {
      nominativo: '',
      via: '',
      comune: '',
      paese: '',
      telefono: '',
      email: '',
      note: '',
    },
  })

  useEffect(() => {
    let active = true
    clientiApi.getAll().then((data) => {
      if (active) setClienti(data)
    })
    return () => { active = false }
  }, [])

  const openCreate = () => {
    setEditId(null)
    reset({
      nominativo: '', via: '', comune: '', paese: '',
      telefono: '', email: '', note: '',
    })
    modalRef.current?.open()
  }

  const openEdit = (c: Cliente) => {
    setEditId(c.id)
    reset({
      nominativo: c.nominativo,
      via: c.via,
      comune: c.comune,
      paese: c.paese,
      telefono: c.telefono ?? '',
      email: c.email ?? '',
      note: c.note ?? '',
    })
    modalRef.current?.open()
  }

  const onSubmit = async (data: FormValues) => {
    if (editId) {
      await clientiApi.update(editId, data)
    } else {
      await clientiApi.create(data)
    }
    modalRef.current?.close()
    const updated = await clientiApi.getAll()
    setClienti(updated)
  }

  const onSelectAddress = (res: GeocodingResult) => {
    setValue('via', res.via, { shouldValidate: true })
    setValue('comune', res.comune, { shouldValidate: true })
    setValue('paese', res.paese, { shouldValidate: true })
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clienti</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          Nuovo cliente
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Nominativo</th>
              <th>Indirizzo</th>
              <th>Paese</th>
              <th className="text-right">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {clienti.map((c) => (
              <tr
                key={c.id}
                className="cursor-pointer hover"
                onClick={() => router.push(`/dashboard/clienti/${c.id}`)}
              >
                <td className="font-medium">{c.nominativo}</td>
                <td>{c.via}, {c.comune}</td>
                <td>{c.paese}</td>
                <td className="text-right">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={(e) => { e.stopPropagation(); openEdit(c) }}
                  >
                    Modifica
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Modal ref={modalRef} title={editId ? 'Modifica cliente' : 'Nuovo cliente'}>
        <form onSubmit={(e) => handleSubmit(onSubmit)(e)} className="space-y-4">

          {/* Nominativo */}
          <div className="space-y-1">
            <input
              className={`input input-bordered w-full ${errors.nominativo ? 'input-error' : ''}`}
              placeholder="Nominativo *"
              {...register('nominativo')}
            />
            {errors.nominativo && (
              <p className="text-error text-xs">{errors.nominativo.message}</p>
            )}
          </div>

          {/* Indirizzo */}
          <div className="space-y-2">
            <label className="text-sm opacity-70">Indirizzo</label>

            <AddressInput onSelect={onSelectAddress} />

            <div className="space-y-1">
              <input
                className={`input input-bordered w-full ${errors.via ? 'input-error' : ''}`}
                placeholder="Via *"
                {...register('via')}
              />
              {errors.via && (
                <p className="text-error text-xs">{errors.via.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <input
                  className={`input input-bordered w-full ${errors.comune ? 'input-error' : ''}`}
                  placeholder="Comune *"
                  {...register('comune')}
                />
                {errors.comune && (
                  <p className="text-error text-xs">{errors.comune.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <input
                  className={`input input-bordered w-full ${errors.paese ? 'input-error' : ''}`}
                  placeholder="Paese *"
                  {...register('paese')}
                />
                {errors.paese && (
                  <p className="text-error text-xs">{errors.paese.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contatti */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <input
                className={`input input-bordered w-full ${errors.telefono ? 'input-error' : ''}`}
                placeholder="Telefono"
                {...register('telefono')}
              />
              {errors.telefono && (
                <p className="text-error text-xs">{errors.telefono.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <input
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                placeholder="Email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-error text-xs">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1">
            <textarea
              className={`textarea textarea-bordered w-full ${errors.note ? 'textarea-error' : ''}`}
              placeholder="Note"
              rows={3}
              {...register('note')}
            />
            {errors.note && (
              <p className="text-error text-xs">{errors.note.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => modalRef.current?.close()}
            >
              Annulla
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvataggio...' : 'Salva'}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  )
}