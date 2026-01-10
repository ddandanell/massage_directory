'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Treatment {
    id: string
    name: string
    category: string
    isPublished: boolean
    createdAt: string
}

export default function AdminTreatmentsPage() {
    const [treatments, setTreatments] = useState<Treatment[]>([])
    const [loading, setLoading] = useState(true)

    const fetchTreatments = async () => {
        try {
            const response = await fetch('/api/admin/treatments')
            const data = await response.json()
            if (response.ok) {
                setTreatments(data.treatments)
            }
        } catch (error) {
            console.error('Error fetching treatments:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTreatments()
    }, [])

    const togglePublish = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch('/api/admin/treatments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isPublished: !currentStatus })
            })

            if (response.ok) {
                setTreatments(prev => prev.map(t =>
                    t.id === id ? { ...t, isPublished: !currentStatus } : t
                ))
            }
        } catch (error) {
            console.error('Error toggling publish status:', error)
        }
    }

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">Loading...</div>

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <Link href="/admin" className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-bold text-white">Manage Treatments</h1>
                        <p className="text-slate-400">Review and publish AI-generated treatment pages</p>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50 border-b border-slate-700">
                                <th className="px-6 py-4 text-slate-400 font-semibold text-sm">Treatment Name</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-sm">Category</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-sm">Created At</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-sm text-center">Status</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {treatments.map((treatment) => (
                                <tr key={treatment.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium">{treatment.name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded-md">
                                            {treatment.category || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">
                                        {new Date(treatment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${treatment.isPublished
                                                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/30'
                                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                                            }`}>
                                            {treatment.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => togglePublish(treatment.id, treatment.isPublished)}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${treatment.isPublished
                                                    ? 'text-amber-400 hover:bg-amber-400/10'
                                                    : 'text-emerald-400 hover:bg-emerald-400/10'
                                                }`}
                                        >
                                            {treatment.isPublished ? 'Unpublish' : 'Publish'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
