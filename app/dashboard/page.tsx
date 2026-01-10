import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/auth/signin')
    }

    const profile = await prisma.freelancerProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            location: true,
            _count: {
                select: { services: true }
            }
        }
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Welcome, {session.user.name}</h1>
                        <p className="text-slate-400">Manage your professional profile and services</p>
                    </div>
                    {profile && (
                        <Link
                            href="/dashboard/profile"
                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all"
                        >
                            Edit Profile
                        </Link>
                    )}
                </div>

                {!profile ? (
                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-3xl p-12 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Start Your Journey</h2>
                        <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                            You haven't created a therapist profile yet. Create one now to start appearing in search results and connecting with clients.
                        </p>
                        <Link
                            href="/dashboard/profile"
                            className="inline-block px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
                        >
                            Create Your Profile
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Status Card */}
                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                            <p className="text-sm text-slate-400 mb-1">Profile Status</p>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${profile.status === 'APPROVED' ? 'bg-emerald-500' :
                                        profile.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                                    } shadow-[0_0_8px_rgba(0,255,0,0.5)]`} />
                                <h3 className="text-xl font-bold text-white">{profile.status}</h3>
                            </div>
                            {profile.status === 'PENDING' && (
                                <p className="text-sm text-slate-500 mt-2">Our team is reviewing your profile. This usually takes 24-48 hours.</p>
                            )}
                            {profile.status === 'REJECTED' && (
                                <div className="mt-4 p-3 bg-red-950/30 border border-red-900 rounded-lg">
                                    <p className="text-sm text-red-400 font-medium">Rejection Reason:</p>
                                    <p className="text-sm text-slate-300">{profile.rejectionReason || 'No reason provided.'}</p>
                                </div>
                            )}
                        </div>

                        {/* Location Card */}
                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                            <p className="text-sm text-slate-400 mb-1">Primary Location</p>
                            <h3 className="text-xl font-bold text-white">{profile.location.name}</h3>
                            <p className="text-sm text-slate-500 mt-1">{profile.location.region}</p>
                        </div>

                        {/* Services Card */}
                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                            <p className="text-sm text-slate-400 mb-1">Active Services</p>
                            <h3 className="text-xl font-bold text-white">{profile._count.services} Treatments</h3>
                            <p className="text-sm text-slate-500 mt-1">Offered on your profile</p>
                        </div>

                        {/* Public Link Card - Span 3 */}
                        {profile.status === 'APPROVED' && (
                            <div className="md:col-span-3 bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Your profile is live!</h3>
                                    <p className="text-slate-400 text-sm">You can share your direct profile link with clients.</p>
                                </div>
                                <Link
                                    href={`/freelancers/${profile.slug}`}
                                    className="px-6 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-medium rounded-lg border border-emerald-500/30 transition-all"
                                >
                                    View Public Profile
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
