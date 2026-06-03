import api from './index'

export type StatisticheFilters = {
  dal: string
  al: string
  statoId?: number
}

export type StatisticheResponse = {
  dal: string
  al: string
  numeroConsegne: number
  tempoMedioConsegnaOre: number | null
  perStato: {
    statoId: number
    descrizione: string
    count: number
  }[]
}

export const statisticheApi = {
  get: async (filters: StatisticheFilters): Promise<StatisticheResponse> => {
    const response = await api.get<StatisticheResponse>('/statistiche', {
      params: filters,
    })
    return response.data
  },
}