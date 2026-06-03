// lib/axios/consegne.ts

import api from './index'
import { Consegna, CreateConsegna, UpdateConsegna } from '@/lib/schemas/consegna.schema'

export type ConsegneFilters = {
  clienteId?: number
  stato?: string
}

export type UpdateStatoPayload = {
  stato: number
}

export const consegneApi = {
  getAll: async (filters?: ConsegneFilters): Promise<Consegna[]> => {
    const response = await api.get<Consegna[]>('/consegna', { params: filters })
    return response.data
  },

  getById: async (id: number): Promise<Consegna> => {
    const response = await api.get<Consegna>(`/consegna/${id}`)
    return response.data
  },

  create: async (data: CreateConsegna): Promise<Consegna> => {
    const response = await api.post<Consegna>('/consegna', data, {
      successMessage: 'Consegna creata con successo',
    } as never)
    return response.data
  },

  update: async (id: number, data: UpdateConsegna): Promise<Consegna> => {
    const response = await api.patch<Consegna>(`/consegna/${id}`, data, {
      successMessage: 'Consegna aggiornata con successo',
    } as never)
    return response.data
  },

  updateStato: async (id: number, stato: number): Promise<Consegna> => {
    const response = await api.patch<Consegna>(`/consegna/${id}/stato`, { stato } as UpdateStatoPayload, {
      successMessage: 'Stato aggiornato con successo',
    } as never)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/consegna/${id}`, {
      successMessage: 'Consegna eliminata con successo',
    } as never)
  },
}