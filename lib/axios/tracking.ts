// lib/axios/tracking.ts

import axios from 'axios'

export type TrackingRequest = {
    chiaveConsegna: string
    dataRitiro: string // ISO date string: 'YYYY-MM-DD'
}

export type TrackingResponse = {
    id: number

    stato: {
        id: number
        descrizione: string
    }

    dataRitiro: string
    dataConsegna: string | null

    chiaveConsegna: string
}

// Istanza separata senza interceptor auth — endpoint pubblico
const publicApi = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
})

export const trackingApi = {
    track: async (data: TrackingRequest): Promise<TrackingResponse> => {
        const response = await publicApi.get<TrackingResponse>('/tracking', {
            params: {
                chiave: data.chiaveConsegna,
                dataRitiro: data.dataRitiro,
            },
        })
        return response.data
    },
}