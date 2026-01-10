import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface TreatmentPageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: TreatmentPageProps): Promise<Metadata> {
    const treatment = await prisma.treatment.findUnique({
        where: { slug: params.slug, isPublished: true }
    })

    if (!treatment) {
        return {
            title: 'Treatment Not Found'
        }
    }

    return {
        title: `${treatment.name} - Massage Treatment Guide`,
        description: treatment.description.substring(0, 160),
        openGraph: {
            title: treatment.name,
            description: treatment.description.substring(0, 160),
            type: 'article'
        }
    }
}

export default async function TreatmentPage({ params }: TreatmentPageProps) {
    const treatment = await prisma.treatment.findUnique({
        where: { slug: params.slug, isPublished: true },
        include: {
            services: {
                include: {
                    freelancerProfile: {
                        include: {
                            location: true
                        },
                        where: {
                            status: 'APPROVED'
                        }
                    }
                }
            },
            relatedTreatments: {
                include: {
                    relatedTreatment: true
                },
                take: 6
            }
        }
    })

    if (!treatment) {
        notFound()
    }

    // Format prices
    const globalPriceRange = treatment.priceRangeGlobalMin && treatment.priceRangeGlobalMax
        ? `$${(treatment.priceRangeGlobalMin / 100).toFixed(0)} - $${(treatment.priceRangeGlobalMax / 100).toFixed(0)}`
        : 'Varies'

    const indonesiaPriceRange = treatment.priceRangeIndonesiaMin && treatment.priceRangeIndonesiaMax
        ? `Rp ${treatment.priceRangeIndonesiaMin.toLocaleString()} - Rp ${treatment.priceRangeIndonesiaMax.toLocaleString()}`
        : 'Varies'

    // Schema markup for SEO
    const schemaMarkup = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: treatment.name,
        description: treatment.description,
        provider: {
            '@type': 'Organization',
            name: 'Massage Directory'
        },
        areaServed: 'Bali, Indonesia',
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            lowPrice: treatment.priceRangeGlobalMin ? treatment.priceRangeGlobalMin / 100 : undefined,
            highPrice: treatment.priceRangeGlobalMax ? treatment.priceRangeGlobalMax / 100 : undefined
        }
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
                        <Link href="/treatments" className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block">
                            ← Back to All Treatments
                        </Link>
                        <h1 className="text-5xl font-bold text-white mb-4">{treatment.name}</h1>
                        {treatment.aliases.length > 0 && (
                            <p className="text-slate-400">
                                Also known as: {treatment.aliases.join(', ')}
                            </p>
                        )}
                        {treatment.origin && (
                            <p className="text-emerald-400 mt-2">Origin: {treatment.origin}</p>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            <section className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                                <h2 className="text-2xl font-semibold text-white mb-4">About This Treatment</h2>
                                <p className="text-slate-300 leading-relaxed">{treatment.description}</p>
                            </section>

                            {/* Techniques */}
                            <section className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                                <h2 className="text-2xl font-semibold text-white mb-4">Techniques Used</h2>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{treatment.techniques}</p>
                            </section>

                            {/* Benefits */}
                            <section className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                                <h2 className="text-2xl font-semibold text-white mb-4">Benefits</h2>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{treatment.benefits}</p>
                            </section>

                            {/* Contraindications */}
                            <section className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                                <h2 className="text-2xl font-semibold text-white mb-4">Contraindications & Precautions</h2>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{treatment.contraindications}</p>
                            </section>

                            {/* Who Should Book */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <section className="bg-emerald-900/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-800/50">
                                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">Who Should Book</h3>
                                    <p className="text-slate-300 leading-relaxed">{treatment.whoShouldBook}</p>
                                </section>

                                <section className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-6 border border-red-800/50">
                                    <h3 className="text-xl font-semibold text-red-400 mb-3">Who Should Avoid</h3>
                                    <p className="text-slate-300 leading-relaxed">{treatment.whoShouldNotBook}</p>
                                </section>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Pricing */}
                            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                                <h3 className="text-xl font-semibold text-white mb-4">Typical Pricing</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-slate-400 text-sm">Global Range</p>
                                        <p className="text-2xl font-bold text-emerald-400">{globalPriceRange}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm">Indonesia Range</p>
                                        <p className="text-2xl font-bold text-emerald-400">{indonesiaPriceRange}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Duration */}
                            {treatment.durationOptions.length > 0 && (
                                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                                    <h3 className="text-xl font-semibold text-white mb-4">Typical Duration</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {treatment.durationOptions.map(duration => (
                                            <span key={duration} className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300">
                                                {duration} min
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Related Treatments */}
                            {treatment.relatedTreatments.length > 0 && (
                                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                                    <h3 className="text-xl font-semibold text-white mb-4">Related Treatments</h3>
                                    <div className="space-y-2">
                                        {treatment.relatedTreatments.map(({ relatedTreatment }) => (
                                            <Link
                                                key={relatedTreatment.id}
                                                href={`/treatments/${relatedTreatment.slug}`}
                                                className="block p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                                            >
                                                <p className="text-emerald-400 font-medium">{relatedTreatment.name}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Available Providers */}
                    {treatment.services.length > 0 && (
                        <section className="mt-12">
                            <h2 className="text-3xl font-bold text-white mb-6">Available Providers</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {treatment.services.map(({ freelancerProfile, customPricing }) => (
                                    <Link
                                        key={freelancerProfile.id}
                                        href={`/freelancers/${freelancerProfile.slug}`}
                                        className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-emerald-500 transition-all"
                                    >
                                        <h3 className="text-xl font-semibold text-white mb-2">{freelancerProfile.name}</h3>
                                        <p className="text-slate-400 mb-3">{freelancerProfile.location.name}</p>
                                        {customPricing && (
                                            <p className="text-emerald-400 font-semibold">
                                                Rp {customPricing.toLocaleString()}
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </>
    )
}
