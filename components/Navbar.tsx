'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
    const { data: session, status } = useSession()

    return (
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-2xl font-bold text-white group">
                        Massage<span className="text-emerald-400 group-hover:text-emerald-300 transition-colors">Directory</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link href="/freelancers" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                            Find Therapist
                        </Link>
                        <Link href="/treatments" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                            Treatments
                        </Link>
                        <Link href="/locations" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                            Locations
                        </Link>

                        {status === 'loading' ? (
                            <div className="w-20 h-8 bg-slate-800 animate-pulse rounded-lg"></div>
                        ) : session ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className="text-slate-300 hover:text-white text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                {session.user.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        className="text-amber-400 hover:text-amber-300 text-sm font-medium"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="text-slate-400 hover:text-red-400 text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                                <Link
                                    href="/dashboard/profile"
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:scale-105"
                                >
                                    My Profile
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/auth/signin" className="text-slate-300 hover:text-white text-sm font-medium">
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:scale-105"
                                >
                                    Join as Therapist
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
