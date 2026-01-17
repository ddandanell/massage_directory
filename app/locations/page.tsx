import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { EXTERNAL_LINKS } from '@/lib/constants/external-links'

export const metadata: Metadata = {
    title: 'Massage Locations in Bali - Find Therapists Near You',
    description: 'Discover massage therapists and wellness centers across Bali. Browse by location to find the perfect massage experience near you.'
}

export default async function LocationsPage() {
    const locations = await prisma.location.findMany({
        where: { isPublished: true },
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { freelancers: true }
            }
        }
    })

    // Group by region
    const groupedLocations = locations.reduce((acc, location) => {
        const region = location.region
        if (!acc[region]) {
            acc[region] = []
        }
        acc[region].push(location)
        return acc
    }, {} as Record<string, typeof locations>)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">Massage Locations in Bali</h1>
                    <p className="text-xl text-slate-400">
                        Find massage therapists in {locations.length} locations across Bali. Whether you prefer visiting a spa or the comfort of your accommodation, we help you discover the best massage experiences. For personalized <a href={EXTERNAL_LINKS.HOME_MASSAGE_UBUD.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-400/30 hover:decoration-emerald-300 transition-colors">home massage services in Ubud</a>, check out our trusted partner.
                    </p>
                </div>

                <div className="space-y-12">
                    {Object.entries(groupedLocations).map(([region, regionLocations]) => (
                        <section key={region}>
                            <h2 className="text-3xl font-bold text-emerald-400 mb-6">{region}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {regionLocations.map(location => (
                                    <Link
                                        key={location.id}
                                        href={`/locations/${location.slug}`}
                                        className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-emerald-500 transition-all hover:scale-105"
                                    >
                                        <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                            {location.name}
                                        </h3>
                                        <p className="text-slate-300 line-clamp-3 mb-4">
                                            {location.description}
                                        </p>
                                        {location._count.freelancers > 0 && (
                                            <p className="text-emerald-400 text-sm">
                                                {location._count.freelancers} therapist{location._count.freelancers !== 1 ? 's' : ''} available
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
}
