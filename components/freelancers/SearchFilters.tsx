'use client'

import { useState, useEffect } from 'react'

interface Location {
    id: string
    name: string
}

interface Treatment {
    id: string
    name: string
}

interface SearchFiltersProps {
    locations: Location[]
    treatments: Treatment[]
    onFilterChange: (filters: { query: string, locationId: string, treatmentId: string }) => void
}

export default function SearchFilters({ locations, treatments, onFilterChange }: SearchFiltersProps) {
    const [query, setQuery] = useState('')
    const [locationId, setLocationId] = useState('')
    const [treatmentId, setTreatmentId] = useState('')

    // Debounce filter changes
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange({ query, locationId, treatmentId })
        }, 300)

        return () => clearTimeout(timer)
    }, [query, locationId, treatmentId, onFilterChange])

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-800 space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Search</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name or keyword..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                    />
                    <svg className="w-5 h-5 text-slate-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                    <select
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                    >
                        <option value="">All Locations</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Treatment</label>
                    <select
                        value={treatmentId}
                        onChange={(e) => setTreatmentId(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                    >
                        <option value="">All Treatments</option>
                        {treatments.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
