'use strict'

/**
 * @file ProfileForm.tsx
 * @description Client-side form for freelancer profile management.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'

interface Location {
    id: string
    name: string
    region: string
}

interface Treatment {
    id: string
    name: string
}

interface Service {
    treatmentId: string
    customPricing?: number
    durationMinutes?: number
    customDescription?: string
    treatment?: Treatment
}

interface ProfileData {
    id: string
    name: string
    bio: string
    experience: string
    locationId: string
    availability?: string | null
    contactPhone?: string | null
    contactEmail?: string | null
    contactWhatsApp?: string | null
    photos: string[]
    services: Service[]
}

interface ProfileFormProps {
    initialData: ProfileData | null
    locations: Location[]
    treatments: Treatment[]
}

export default function ProfileForm({ initialData, locations, treatments }: ProfileFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        bio: initialData?.bio || '',
        experience: initialData?.experience || '',
        locationId: initialData?.locationId || '',
        availability: initialData?.availability || '',
        contactPhone: initialData?.contactPhone || '',
        contactEmail: initialData?.contactEmail || '',
        contactWhatsApp: initialData?.contactWhatsApp || '',
        photos: initialData?.photos || [],
        services: initialData?.services.map(s => ({
            treatmentId: s.treatmentId,
            customPricing: s.customPricing || 0,
            durationMinutes: s.durationMinutes || 0,
            customDescription: s.customDescription || ''
        })) || []
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePhotosChange = (urls: string[]) => {
        setFormData(prev => ({ ...prev, photos: urls }))
    }

    const addService = () => {
        setFormData(prev => ({
            ...prev,
            services: [...prev.services, { treatmentId: '', customPricing: 0, durationMinutes: 0, customDescription: '' }]
        }))
    }

    const updateService = (index: number, field: keyof Service, value: string | number) => {
        const newServices = [...formData.services]
        newServices[index] = { ...newServices[index], [field]: value }
        setFormData(prev => ({ ...prev, services: newServices }))
    }

    const removeService = (index: number) => {
        setFormData(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Filter out empty photos and empty services
            const cleanedPhotos = formData.photos.filter(url => url.trim() !== '')
            const cleanedServices = formData.services.filter(s => s.treatmentId !== '')

            const payload = {
                ...formData,
                photos: cleanedPhotos,
                // Ensure numbers are numbers
                services: cleanedServices.map(s => ({
                    ...s,
                    customPricing: Number(s.customPricing) || undefined,
                    durationMinutes: Number(s.durationMinutes) || undefined
                }))
            }

            const response = await fetch('/api/profiles', {
                method: initialData ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong')
            }

            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="p-4 bg-red-950/30 border border-red-900 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Basic Information */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Basic Information</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Professional Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="e.g. Sari's Holistic Massage"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Your Bio (min 50 chars)</label>
                        <textarea
                            name="bio"
                            required
                            rows={4}
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Tell potential clients about yourself..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Experience & Training (min 50 chars)</label>
                        <textarea
                            name="experience"
                            required
                            rows={4}
                            value={formData.experience}
                            onChange={handleInputChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Describe your qualifications and specialized training..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                        <select
                            name="locationId"
                            required
                            value={formData.locationId}
                            onChange={handleInputChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            <option value="">Select a location</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name} ({loc.region})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">WhatsApp (Recommended)</label>
                        <input
                            type="text"
                            name="contactWhatsApp"
                            value={formData.contactWhatsApp}
                            onChange={handleInputChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="+62 812..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                        <input
                            type="text"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Public Email</label>
                        <input
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Availability</label>
                        <input
                            type="text"
                            name="availability"
                            value={formData.availability}
                            onChange={handleInputChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="e.g. Mon-Fri, 9am - 6pm"
                        />
                    </div>
                </div>
            </section>

            {/* Photos */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Photos</h3>
                <ImageUpload
                    value={formData.photos}
                    onChange={handlePhotosChange}
                    maxImages={10}
                />
            </section>

            {/* Services Offered */}
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">Services Offered</h3>
                    <button
                        type="button"
                        onClick={addService}
                        className="text-sm text-emerald-400 hover:text-emerald-300"
                    >
                        + Add Treatment
                    </button>
                </div>

                <div className="space-y-6">
                    {formData.services.map((service, index) => (
                        <div key={index} className="p-6 bg-slate-800/30 border border-slate-700 rounded-2xl space-y-4 relative">
                            <button
                                type="button"
                                onClick={() => removeService(index)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Treatment Type</label>
                                    <select
                                        required
                                        value={service.treatmentId}
                                        onChange={(e) => updateService(index, 'treatmentId', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="">Select Treatment</option>
                                        {treatments.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Price (IDR)</label>
                                    <input
                                        type="number"
                                        value={service.customPricing}
                                        onChange={(e) => updateService(index, 'customPricing', parseInt(e.target.value))}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="300000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Duration (Minutes)</label>
                                    <input
                                        type="number"
                                        value={service.durationMinutes}
                                        onChange={(e) => updateService(index, 'durationMinutes', parseInt(e.target.value))}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="60"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Custom Description (Optional)</label>
                                    <input
                                        type="text"
                                        value={service.customDescription}
                                        onChange={(e) => updateService(index, 'customDescription', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="e.g. Includes organic essential oils..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {formData.services.length === 0 && (
                        <p className="text-center text-slate-500 py-8 border-2 border-dashed border-slate-800 rounded-2xl">
                            No services added yet. Click "+ Add Treatment" to get started.
                        </p>
                    )}
                </div>
            </section>

            <div className="pt-8 border-t border-slate-800 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : initialData ? 'Update Profile' : 'Create Profile'}
                </button>
            </div>
        </form>
    )
}
