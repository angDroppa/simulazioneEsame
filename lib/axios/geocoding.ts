// lib/api/geocoding.api.ts

import api from './index'
import { GeocodingResult } from '@/lib/schemas/geocoding.schema'

export const geocodingApi = {
  search: async (q: string): Promise<GeocodingResult[]> => {
    const response = await api.get<GeocodingResult[]>('/geocoding', {
      params: { q },
    })
    return response.data
  },
}