import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface LocationPageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
    const location = await prisma.location.findUnique({
        where: { slug: params.slug, isPublished: true }
    })

    if (!location) {
        return {
            title: 'Location Not Found'
        }
    }

    return {
        title: `Massage in ${location.name} - ${location.region}`,
        description: location.description.substring(0, 160),
        openGraph: {
            title: `Massage in ${location.name}`,
            description: location.description.substring(0, 160),
            type: 'article'
        }
    }
}

export default async function LocationPage({ params }: LocationPageProps) {
    const location = await prisma.location.findUnique({
        where: { slug: params.slug, isPublished: true },
        include: {
            freelancers: {
                where: {
                    status: 'APPROVED'
                },
                include: {
                    services: {
                        include: {
                            treatment: true
                        }
                    }
                }
            }
        }
    })

    if (!location) {
        notFound()
    }

    // Get unique treatments available in this location
    const availableTreatments = new Map()
    location.freelancers.forEach(freelancer => {
        freelancer.services.forEach(service => {
            if (!availableTreatments.has(service.treatment.id)) {
                availableTreatments.set(service.treatment.id, service.treatment)
            }
        })
    })

    // Schema markup for SEO
    const schemaMarkup = {
        '@context': 'https://schema.org',
        '@type': 'Place',
        name: location.name,
        description: location.description,
        address: {
            '@type': 'PostalAddress',
            addressRegion: location.region,
            addressCountry: 'Indonesia'
        },
        geo: location.latitude && location.longitude ? {
            '@type': 'GeoCoordinates',
            latitude: location.latitude,
            longitude: location.longitude
        } : undefined
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
                        <Link href="/locations" className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block">
                            ← Back to All Locations
                        </Link>
                        <h1 className="text-5xl font-bold text-white mb-4">Massage in {location.name}</h1>
                        <p className="text-xl text-slate-400">{location.region}, Indonesia</p>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Description */}
                        <section className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                            <h2 className="text-2xl font-semibold text-white mb-4">About {location.name}</h2>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{location.description}</p>
                        </section>

                        {/* Massage Culture */}
                        <section className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                            <h2 className="text-2xl font-semibold text-white mb-4">Massage Culture in {location.name}</h2>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{location.massageCulture}</p>
                        </section>

                        {/* Available Treatments */}
                        {availableTreatments.size > 0 && (
                            <section className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                                <h2 className="text-2xl font-semibold text-white mb-6">Available Treatments</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {Array.from(availableTreatments.values()).map((treatment: any) => (
                                        <Link
                                            key={treatment.id}
                                            href={`/treatments/${treatment.slug}`}
                                            className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-center"
                                        >
                                            <p className="text-emerald-400 font-medium">{treatment.name}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Freelancers */}
                        {location.freelancers.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-white mb-6">
                                    Massage Therapists in {location.name}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {location.freelancers.map(freelancer => (
                                        <Link
                                            key={freelancer.id}
                                            href={`/freelancers/${freelancer.slug}`}
                                            className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-emerald-500 transition-all"
                                        >
                                            <h3 className="text-2xl font-semibold text-white mb-2">{freelancer.name}</h3>
                                            <p className="text-slate-300 line-clamp-2 mb-4">{freelancer.bio}</p>
                                            <p className="text-emerald-400 text-sm">
                                                {freelancer.services.length} treatment{freelancer.services.length !== 1 ? 's' : ''} offered
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {location.freelancers.length === 0 && (
                            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 text-center">
                                <p className="text-slate-400">
                                    No massage therapists listed in {location.name} yet.
                                    <Link href="/dashboard/profile" className="text-emerald-400 hover:text-emerald-300 ml-2">
                                        Be the first to create a profile →
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
