import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface FreelancerPageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: FreelancerPageProps): Promise<Metadata> {
    const freelancer = await prisma.freelancerProfile.findUnique({
        where: { slug: params.slug, status: 'APPROVED' },
        include: { location: true }
    })

    if (!freelancer) {
        return {
            title: 'Profile Not Found'
        }
    }

    return {
        title: `${freelancer.name} - Massage Therapist in ${freelancer.location.name}`,
        description: freelancer.bio.substring(0, 160),
        openGraph: {
            title: freelancer.name,
            description: freelancer.bio.substring(0, 160),
            type: 'profile'
        }
    }
}

export default async function FreelancerPage({ params }: FreelancerPageProps) {
    const freelancer = await prisma.freelancerProfile.findUnique({
        where: { slug: params.slug, status: 'APPROVED' },
        include: {
            location: true,
            services: {
                include: {
                    treatment: true
                },
                orderBy: {
                    treatment: {
                        name: 'asc'
                    }
                }
            }
        }
    })

    if (!freelancer) {
        notFound()
    }

    // Schema markup for SEO
    const schemaMarkup = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: freelancer.name,
        description: freelancer.bio,
        address: {
            '@type': 'PostalAddress',
            addressLocality: freelancer.location.name,
            addressRegion: freelancer.location.region,
            addressCountry: 'Indonesia'
        },
        telephone: freelancer.contactPhone || undefined,
        email: freelancer.contactEmail || undefined
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />

            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="max-w-5xl mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href={`/locations/${freelancer.location.slug}`} className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block">
                            ← Back to {freelancer.location.name}
                        </Link>
                        <h1 className="text-5xl font-bold text-white mb-4">{freelancer.name}</h1>
                        <p className="text-xl text-slate-400">
                            {freelancer.location.name}, {freelancer.location.region}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Bio */}
                            <section className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                                <h2 className="text-2xl font-semibold text-white mb-4">About</h2>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{freelancer.bio}</p>
                            </section>

                            {/* Experience */}
                            <section className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                                <h2 className="text-2xl font-semibold text-white mb-4">Experience</h2>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{freelancer.experience}</p>
                            </section>

                            {/* Services Offered */}
                            <section className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                                <h2 className="text-2xl font-semibold text-white mb-6">Services Offered</h2>
                                <div className="space-y-4">
                                    {freelancer.services.map(service => (
                                        <div key={service.id} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                                            <div className="flex justify-between items-start mb-3">
                                                <Link
                                                    href={`/treatments/${service.treatment.slug}`}
                                                    className="text-xl font-semibold text-emerald-400 hover:text-emerald-300"
                                                >
                                                    {service.treatment.name}
                                                </Link>
                                                {service.customPricing && (
                                                    <span className="text-2xl font-bold text-white">
                                                        Rp {service.customPricing.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            {service.durationMinutes && (
                                                <p className="text-slate-400 mb-2">Duration: {service.durationMinutes} minutes</p>
                                            )}
                                            <p className="text-slate-300 line-clamp-2">
                                                {service.customDescription || service.treatment.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Contact */}
                            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                                <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
                                <div className="space-y-3">
                                    {freelancer.contactWhatsApp && (
                                        <a
                                            href={`https://wa.me/${freelancer.contactWhatsApp.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-3 bg-green-900/30 border border-green-700 rounded-lg hover:bg-green-900/50 transition-colors"
                                        >
                                            <p className="text-green-400 font-medium">WhatsApp</p>
                                            <p className="text-slate-300 text-sm">{freelancer.contactWhatsApp}</p>
                                        </a>
                                    )}
                                    {freelancer.contactPhone && (
                                        <a
                                            href={`tel:${freelancer.contactPhone}`}
                                            className="block p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                                        >
                                            <p className="text-emerald-400 font-medium">Phone</p>
                                            <p className="text-slate-300 text-sm">{freelancer.contactPhone}</p>
                                        </a>
                                    )}
                                    {freelancer.contactEmail && (
                                        <a
                                            href={`mailto:${freelancer.contactEmail}`}
                                            className="block p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                                        >
                                            <p className="text-emerald-400 font-medium">Email</p>
                                            <p className="text-slate-300 text-sm break-all">{freelancer.contactEmail}</p>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Availability */}
                            {freelancer.availability && (
                                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                                    <h3 className="text-xl font-semibold text-white mb-4">Availability</h3>
                                    <p className="text-slate-300 whitespace-pre-line">{freelancer.availability}</p>
                                </div>
                            )}

                            {/* Photos */}
                            {freelancer.photos.length > 0 && (
                                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                                    <h3 className="text-xl font-semibold text-white mb-4">Gallery</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {freelancer.photos.map((photo, index) => (
                                            <img
                                                key={index}
                                                src={photo}
                                                alt={`${freelancer.name} - Photo ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
