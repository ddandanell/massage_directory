import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/auth/signin')
    }

    const stats = await prisma.$transaction([
        prisma.treatment.count({ where: { isPublished: true } }),
        prisma.treatment.count({ where: { isPublished: false } }),
        prisma.location.count({ where: { isPublished: true } }),
        prisma.location.count({ where: { isPublished: false } }),
        prisma.freelancerProfile.count({ where: { status: 'APPROVED' } }),
        prisma.freelancerProfile.count({ where: { status: 'PENDING' } }),
        prisma.freelancerProfile.count({ where: { status: 'REJECTED' } }),
        prisma.notification.count({ where: { isRead: false } })
    ])

    const [
        publishedTreatments,
        unpublishedTreatments,
        publishedLocations,
        unpublishedLocations,
        approvedProfiles,
        pendingProfiles,
        rejectedProfiles,
        unreadNotifications
    ] = stats

    const recentNotifications = await prisma.notification.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-5xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-slate-400">Manage your massage directory platform</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                        <h3 className="text-slate-400 text-sm mb-2">Published Treatments</h3>
                        <p className="text-4xl font-bold text-emerald-400">{publishedTreatments}</p>
                        <p className="text-slate-500 text-sm mt-2">{unpublishedTreatments} unpublished</p>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                        <h3 className="text-slate-400 text-sm mb-2">Published Locations</h3>
                        <p className="text-4xl font-bold text-emerald-400">{publishedLocations}</p>
                        <p className="text-slate-500 text-sm mt-2">{unpublishedLocations} unpublished</p>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                        <h3 className="text-slate-400 text-sm mb-2">Approved Profiles</h3>
                        <p className="text-4xl font-bold text-emerald-400">{approvedProfiles}</p>
                        <p className="text-slate-500 text-sm mt-2">{rejectedProfiles} rejected</p>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-800">
                        <h3 className="text-slate-400 text-sm mb-2">Pending Approval</h3>
                        <p className="text-4xl font-bold text-red-400">{pendingProfiles}</p>
                        <Link href="/admin/profiles" className="text-red-400 text-sm mt-2 inline-block hover:text-red-300">
                            Review now →
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Link
                        href="/admin/treatments"
                        className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-emerald-500 transition-all group"
                    >
                        <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-emerald-400">
                            Manage Treatments
                        </h3>
                        <p className="text-slate-400">Create, edit, and publish treatment pages</p>
                    </Link>

                    <Link
                        href="/admin/locations"
                        className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-emerald-500 transition-all group"
                    >
                        <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-emerald-400">
                            Manage Locations
                        </h3>
                        <p className="text-slate-400">Create, edit, and publish location pages</p>
                    </Link>

                    <Link
                        href="/admin/profiles"
                        className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-emerald-500 transition-all group"
                    >
                        <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-emerald-400">
                            Review Profiles
                        </h3>
                        <p className="text-slate-400">Approve or reject freelancer profiles</p>
                    </Link>
                </div>

                {/* Recent Notifications */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                    <h2 className="text-2xl font-semibold text-white mb-6">Recent Notifications</h2>
                    {recentNotifications.length === 0 ? (
                        <p className="text-slate-400">No notifications</p>
                    ) : (
                        <div className="space-y-4">
                            {recentNotifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-lg border ${notification.isRead
                                            ? 'bg-slate-800/30 border-slate-700'
                                            : 'bg-emerald-900/20 border-emerald-800'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-white">{notification.title}</h4>
                                        <span className="text-xs text-slate-400">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 text-sm">{notification.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
