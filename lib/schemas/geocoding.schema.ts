// lib/schemas/geocoding.schema.ts

import { z } from 'zod'

export const GeocodingResultSchema = z.object({
  displayName: z.string(),
  via: z.string(),
  comune: z.string(),
  paese: z.string(),
})

export const GeocodingResponseSchema = z.array(GeocodingResultSchema)

export type GeocodingResult = z.infer<typeof GeocodingResultSchema>