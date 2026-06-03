// lib/types/geocoding.ts

export type GeocodingResult = {
  displayName: string
  via: string
  comune: string
  paese: string
}

export type NominatimRaw = {
  display_name: string
  address: {
    road?: string
    city?: string
    town?: string
    village?: string
    municipality?: string
    country?: string
  }
}