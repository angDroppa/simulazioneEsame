// app/api/geocoding/route.ts

import { GeocodingResult, NominatimRaw } from '@/lib/types/geocoding.entity'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  if (!q || q.length < 3) {
    return NextResponse.json({ error: 'Query troppo corta' }, { status: 400 })
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', q)
  url.searchParams.set('countrycodes', 'it')
  url.searchParams.set('format', 'json')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '5')

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'SimulazioneCorriere/1.0 (contatto@tuaapp.it)',
      'Accept-Language': 'it',
    },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Errore Nominatim' }, { status: 502 })
  }

  const data = await res.json()

  const results: GeocodingResult[] = data.map((item: NominatimRaw) => ({
    displayName: item.display_name,
    via: item.address.road ?? '',
    comune: item.address.city ?? item.address.town ?? item.address.village ?? item.address.municipality ?? '',
    paese: item.address.country ?? '',
  }))

  return NextResponse.json(results)
}