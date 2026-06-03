// lib/axios/clienti.ts

import api from './index'
import { Cliente, CreateCliente, UpdateCliente } from '@/lib/schemas/consegna.schema'

export const clientiApi = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await api.get<Cliente[]>('/clienti')
    return response.data
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await api.get<Cliente>(`/clienti/${id}`)
    return response.data
  },

  create: async (data: CreateCliente): Promise<Cliente> => {
    const response = await api.post<Cliente>('/clienti', data, {
      successMessage: 'Cliente creato con successo',
    } as never)
    return response.data
  },

  update: async (id: number, data: UpdateCliente): Promise<Cliente> => {
    const response = await api.patch<Cliente>(`/clienti/${id}`, data, {
      successMessage: 'Cliente aggiornato con successo',
    } as never)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clienti/${id}`, {
      successMessage: 'Cliente eliminato con successo',
    } as never)
  },
}