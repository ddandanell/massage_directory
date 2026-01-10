'use client'

import { useState } from 'react'

interface Service {
    id: string
    treatment: {
        name: string
    }
    customPricing?: number | null
}

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
    services: Service[]
}

interface ProfileReviewCardProps {
    profile: Profile
    onAction: (profileId: string, action: 'approve' | 'reject', reason?: string) => Promise<void>
}

export default function ProfileReviewCard({ profile, onAction }: ProfileReviewCardProps) {
    const [loading, setLoading] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')
    const [showRejectForm, setShowRejectForm] = useState(false)

    const handleAction = async (action: 'approve' | 'reject') => {
        setLoading(true)
        try {
            await onAction(profile.id, action, action === 'reject' ? rejectionReason : undefined)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
                    <p className="text-slate-400">{profile.location.name}, {profile.location.region}</p>
                    <p className="text-xs text-slate-500 mt-1">User: {profile.user.email}</p>
                </div>
                <div className="flex gap-3">
                    {!showRejectForm ? (
                        <>
                            <button
                                onClick={() => setShowRejectForm(true)}
                                className="px-4 py-2 bg-red-950/30 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-950/50 transition-all font-medium"
                                disabled={loading}
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleAction('approve')}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Approve'}
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2 w-full max-w-xs">
                            <textarea
                                placeholder="Reason for rejection..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none focus:ring-1 focus:ring-red-500"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowRejectForm(false)}
                                    className="flex-1 px-3 py-1 bg-slate-800 text-slate-400 rounded-md text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAction('reject')}
                                    className="flex-1 px-3 py-1 bg-red-500 text-white rounded-md text-xs font-bold"
                                    disabled={!rejectionReason || loading}
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</h4>
                        <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">{profile.bio}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experience</h4>
                        <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">{profile.experience}</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Services Offered</h4>
                    <div className="flex flex-wrap gap-2">
                        {profile.services.map(service => (
                            <span
                                key={service.id}
                                className="px-3 py-1 bg-emerald-900/20 text-emerald-400 border border-emerald-800/30 rounded-full text-xs"
                            >
                                {service.treatment.name}
                                {service.customPricing && ` (Rp ${service.customPricing.toLocaleString()})`}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
