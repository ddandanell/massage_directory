'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
    const { data: session, status } = useSession()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-xl md:text-2xl font-bold text-white group">
                        Massage<span className="text-emerald-400 group-hover:text-emerald-300 transition-colors">Directory</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6">
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

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-800 py-4 space-y-4">
                        <Link 
                            href="/freelancers" 
                            className="block text-slate-300 hover:text-white transition-colors text-sm font-medium py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Find Therapist
                        </Link>
                        <Link 
                            href="/treatments" 
                            className="block text-slate-300 hover:text-white transition-colors text-sm font-medium py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Treatments
                        </Link>
                        <Link 
                            href="/locations" 
                            className="block text-slate-300 hover:text-white transition-colors text-sm font-medium py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Locations
                        </Link>

                        {status === 'loading' ? (
                            <div className="w-20 h-8 bg-slate-800 animate-pulse rounded-lg"></div>
                        ) : session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="block text-slate-300 hover:text-white text-sm font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                {session.user.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        className="block text-amber-400 hover:text-amber-300 text-sm font-medium py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    href="/dashboard/profile"
                                    className="block px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all text-sm font-bold text-center mt-4"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false)
                                        signOut({ callbackUrl: '/' })
                                    }}
                                    className="w-full text-left text-slate-400 hover:text-red-400 text-sm font-medium py-2 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    href="/auth/signin" 
                                    className="block text-slate-300 hover:text-white text-sm font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="block px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all text-sm font-bold text-center mt-4"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Join as Therapist
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
