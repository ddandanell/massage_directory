'use client'

import { useState, useEffect } from 'react'
import ProfileReviewCard from '@/components/admin/ProfileReviewCard'
import Link from 'next/link'

interface Profile {
    id: string
    name: string
    bio: string
    experience: string
    status: string
    location: {
        name: string
        region: string
    }
    user: {
        email: string
    }
    services: any[]
}

export default function AdminProfilesPage() {
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const fetchProfiles = async () => {
        try {
            const response = await fetch('/api/admin/profiles')
            const data = await response.json()
            if (response.ok) {
                setProfiles(data.profiles)
            }
        } catch (error) {
            console.error('Error fetching profiles:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfiles()
    }, [])

    const handleAction = async (profileId: string, action: 'approve' | 'reject', rejectionReason?: string) => {
        try {
            const response = await fetch('/api/admin/profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId, action, rejectionReason })
            })

            if (response.ok) {
                setMessage({ type: 'success', text: `Profile ${action === 'approve' ? 'approved' : 'rejected'} successfully!` })
                setProfiles(prev => prev.filter(p => p.id !== profileId))
            } else {
                const error = await response.json()
                setMessage({ type: 'error', text: error.error || 'Failed to update profile' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' })
        }

        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-emerald-400 text-xl font-medium animate-pulse">Loading profiles...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <Link href="/admin" className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-bold text-white">Review Profiles</h1>
                        <p className="text-slate-400">Moderate therapist applications and ensure content quality</p>
                    </div>
                    <div className="bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
                        <span className="text-slate-500 text-sm">Pending:</span>
                        <span className="text-emerald-400 font-bold ml-2">{profiles.length}</span>
                    </div>
                </div>

                {message && (
                    <div className={`mb-8 p-4 rounded-xl border ${message.type === 'success'
                            ? 'bg-emerald-950/30 border-emerald-900 text-emerald-400'
                            : 'bg-red-950/30 border-red-900 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="space-y-6">
                    {profiles.length === 0 ? (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-20 text-center">
                            <h2 className="text-2xl font-bold text-white mb-2">Queue is Clear!</h2>
                            <p className="text-slate-400">There are no pending profile applications at the moment.</p>
                        </div>
                    ) : (
                        profiles.map(profile => (
                            <ProfileReviewCard
                                key={profile.id}
                                profile={profile}
                                onAction={handleAction}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
