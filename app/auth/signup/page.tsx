'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function SignUpPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed')
            }

            // Auto-login after registration
            const signInResult = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false
            })

            if (signInResult?.error) {
                router.push('/auth/signin?error=AutoLoginFailed')
            } else {
                router.push('/dashboard')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400">Join the elite network of massage therapists in Bali</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-950/30 border border-red-900 rounded-xl text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-slate-500 mt-2">Must be at least 6 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-sm">
                            Already have an account?{' '}
                            <Link href="/auth/signin" className="text-emerald-400 font-semibold hover:text-emerald-300">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
