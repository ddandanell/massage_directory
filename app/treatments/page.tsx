import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { EXTERNAL_LINKS } from '@/lib/constants/external-links'

export const metadata: Metadata = {
    title: 'Massage Treatments - Complete Guide',
    description: 'Explore our comprehensive guide to massage treatments worldwide. Learn about techniques, benefits, pricing, and find qualified practitioners.'
}

export default async function TreatmentsPage() {
    const treatments = await prisma.treatment.findMany({
        where: { isPublished: true },
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { services: true }
            }
        }
    })

    // Group by category
    const groupedTreatments = treatments.reduce((acc, treatment) => {
        const category = treatment.category || 'Other'
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(treatment)
        return acc
    }, {} as Record<string, typeof treatments>)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">Massage Treatments</h1>
                    <p className="text-xl text-slate-400">
                        Explore {treatments.length} massage treatments from around the world. Each treatment can be experienced at various locations throughout Bali, or enjoy the comfort of <a href={EXTERNAL_LINKS.HOME_MASSAGE_UBUD.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-400/30 hover:decoration-emerald-300 transition-colors">mobile massage services in Ubud</a> brought directly to your accommodation.
                    </p>
                </div>

                <div className="space-y-12">
                    {Object.entries(groupedTreatments).map(([category, categoryTreatments]) => (
                        <section key={category}>
                            <h2 className="text-3xl font-bold text-emerald-400 mb-6">{category}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categoryTreatments.map(treatment => (
                                    <Link
                                        key={treatment.id}
                                        href={`/treatments/${treatment.slug}`}
                                        className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-emerald-500 transition-all hover:scale-105"
                                    >
                                        <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                            {treatment.name}
                                        </h3>
                                        {treatment.origin && (
                                            <p className="text-slate-400 text-sm mb-3">Origin: {treatment.origin}</p>
                                        )}
                                        <p className="text-slate-300 line-clamp-3 mb-4">
                                            {treatment.description}
                                        </p>
                                        {treatment._count.services > 0 && (
                                            <p className="text-emerald-400 text-sm">
                                                {treatment._count.services} provider{treatment._count.services !== 1 ? 's' : ''} available
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
