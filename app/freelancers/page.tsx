'use client'

import { useState, useEffect, useCallback } from 'react'
import FreelancerCard from '@/components/freelancers/FreelancerCard'
import SearchFilters from '@/components/freelancers/SearchFilters'
import { EXTERNAL_LINKS } from '@/lib/constants/external-links'

interface Location {
    id: string
    name: string
}

interface Treatment {
    id: string
    name: string
}

interface Freelancer {
    id: string
    name: string
    slug: string
    bio: string
    photos: string[]
    location: {
        name: string
    }
    services: {
        id: string
        treatment: {
            name: string
        }
    }[]
}

export default function FreelancersPage() {
    const [freelancers, setFreelancers] = useState<Freelancer[]>([])
    const [locations, setLocations] = useState<Location[]>([])
    const [treatments, setTreatments] = useState<Treatment[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<{ query: string; locationId: string; treatmentId: string }>({ query: '', locationId: '', treatmentId: '' })

    const fetchInitialData = async () => {
        try {
            const [locRes, treatRes] = await Promise.all([
                fetch('/api/locations'),
                fetch('/api/treatments')
            ])
            const [locData, treatData] = await Promise.all([
                locRes.json(),
                treatRes.json()
            ])
            setLocations(locData.locations || [])
            setTreatments(treatData.treatments || [])
        } catch (error) {
            console.error('Error fetching filter data:', error)
        }
    }

    const fetchFreelancers = useCallback(async (currentFilters: { query: string; locationId: string; treatmentId: string }) => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (currentFilters.query) params.append('query', currentFilters.query)
            if (currentFilters.locationId) params.append('locationId', currentFilters.locationId)
            if (currentFilters.treatmentId) params.append('treatmentId', currentFilters.treatmentId)

            const response = await fetch(`/api/freelancers?${params.toString()}`)
            const data = await response.json()
            if (response.ok) {
                setFreelancers(data.freelancers)
            }
        } catch (error) {
            console.error('Error fetching freelancers:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchInitialData()
    }, [])

    const handleFilterChange = (newFilters: { query: string; locationId: string; treatmentId: string }) => {
        setFilters(newFilters)
        fetchFreelancers(newFilters)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20">
            {/* Header section */}
            <div className="relative py-12 md:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full translate-y-20"></div>
                <div className="max-w-7xl mx-auto px-4 relative">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 tracking-tight">
                        Find Your <span className="text-emerald-400">Perfect</span> Therapist
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
                        Discover Bali&apos;s elite network of independent massage professionals.
                        Filter by location, treatment type, or search for your favorite therapist. Prefer the convenience of treatments at your villa? Check out <a href={EXTERNAL_LINKS.HOME_MASSAGE_UBUD.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-400/30 hover:decoration-emerald-300 transition-colors">home massage options in Ubud</a>.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24">
                            <SearchFilters
                                locations={locations}
                                treatments={treatments}
                                onFilterChange={handleFilterChange}
                            />

                            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-emerald-900/10 border border-emerald-900/20 rounded-2xl md:rounded-3xl">
                                <h4 className="text-emerald-400 font-bold mb-2 text-sm md:text-base">Verified Professionals</h4>
                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                                    All therapists in our directory are manually reviewed for quality and experience.
                                </p>
                            </div>

                            <div className="mt-6 p-4 md:p-6 bg-teal-900/10 border border-teal-900/20 rounded-2xl md:rounded-3xl">
                                <h4 className="text-teal-400 font-bold mb-2 text-sm md:text-base">Home Services Available</h4>
                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                                    Prefer massage at your location? Our partners offer <a href={EXTERNAL_LINKS.HOME_MASSAGE_UBUD.url} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 underline decoration-teal-400/30 hover:decoration-teal-300 transition-colors">mobile massage services throughout Ubud</a>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Listings Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-3xl h-80 animate-pulse"></div>
                                ))}
                            </div>
                        ) : freelancers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {freelancers.map(freelancer => (
                                    <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl px-8 py-20 text-center">
                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">No therapists found</h3>
                                <p className="text-slate-400 mb-2 max-w-md mx-auto">
                                    We couldn&apos;t find any therapists matching your search criteria.
                                </p>
                                <p className="text-slate-500 text-sm mb-6">
                                    Try adjusting your filters or search terms to discover more therapists in our directory.
                                </p>
                                <button
                                    onClick={() => handleFilterChange({ query: '', locationId: '', treatmentId: '' })}
                                    className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
