// hooks/useAddressSearch.ts

import { useState, useEffect, useRef } from 'react'
import { GeocodingResult } from '@/lib/schemas/geocoding.schema'
import { geocodingApi } from '@/lib/axios/geocoding'

const DEBOUNCE_MS = 400
const MIN_CHARS = 3

export function useAddressSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (query.length < MIN_CHARS) {
      setResults([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await geocodingApi.search(query)
        setResults(data)
      } catch {
        setError('Errore nella ricerca indirizzo')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const reset = () => {
    setQuery('')
    setResults([])
    setError(null)
  }

  return { query, setQuery, results, isLoading, error, reset }
}