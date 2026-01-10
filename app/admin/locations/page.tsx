'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Location {
    id: string
    name: string
    region: string
    isPublished: boolean
}

export default function AdminLocationsPage() {
    const [locations, setLocations] = useState<Location[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLocations = async () => {
        try {
            const response = await fetch('/api/admin/locations')
            const data = await response.json()
            if (response.ok) {
                setLocations(data.locations)
            }
        } catch (error) {
            console.error('Error fetching locations:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLocations()
    }, [])

    const togglePublish = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch('/api/admin/locations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isPublished: !currentStatus })
            })

            if (response.ok) {
                setLocations(prev => prev.map(l =>
                    l.id === id ? { ...l, isPublished: !currentStatus } : l
                ))
            }
        } catch (error) {
            console.error('Error toggling location status:', error)
        }
    }

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">Loading...</div>

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <Link href="/admin" className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-bold text-white">Manage Locations</h1>
                        <p className="text-slate-400">Manage the Bali areas listed on the platform</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {locations.map((location) => (
                        <div
                            key={location.id}
                            className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 flex flex-col justify-between"
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-white mb-1">{location.name}</h3>
                                <p className="text-slate-500 text-sm">{location.region}</p>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                                <span className={`text-xs font-bold uppercase tracking-wider ${location.isPublished ? 'text-emerald-400' : 'text-slate-500'
                                    }`}>
                                    {location.isPublished ? 'Published' : 'Draft'}
                                </span>
                                <button
                                    onClick={() => togglePublish(location.id, location.isPublished)}
                                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${location.isPublished
                                            ? 'bg-amber-900/20 text-amber-400 hover:bg-amber-900/30 border border-amber-900/30'
                                            : 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/30 border border-emerald-900/30'
                                        }`}
                                >
                                    {location.isPublished ? 'Unpublish' : 'Publish'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
