// components/AddressInput.tsx

'use client'

import { useRef, useState } from 'react'
import { GeocodingResult } from '@/lib/schemas/geocoding.schema'
import { useAddressSearch } from '../hooks/useAddressSearch'

type Props = {
  onSelect: (result: GeocodingResult) => void
}

export function AddressInput({ onSelect }: Props) {
  const { query, setQuery, results, isLoading, error, reset } = useAddressSearch()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSelect = (result: GeocodingResult) => {
    onSelect(result)
    reset()
    setIsOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} onBlur={handleBlur} style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        placeholder="Cerca indirizzo..."
        autoComplete="off"
      />

      {isLoading && <span>Ricerca...</span>}
      {error && <span>{error}</span>}

      {isOpen && results.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 10,
            listStyle: 'none',
            margin: 0,
            padding: 0,
            border: '1px solid #ccc',
            background: '#fff',
          }}
        >
          {results.map((result, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelect(result)}
              style={{ padding: '8px 12px', cursor: 'pointer' }}
            >
              {result.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}