'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Service {
    id: string
    treatment: {
        name: string
    }
}

interface Freelancer {
    id: string
    name: string
    slug: string
    bio: string
    photos: string[]
    location: {
        name: string
    }
    services: Service[]
}

export default function FreelancerCard({ freelancer }: { freelancer: Freelancer }) {
    return (
        <Link
            href={`/freelancers/${freelancer.slug}`}
            className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-800 overflow-hidden hover:border-emerald-500 transition-all hover:scale-[1.02] flex flex-col"
            aria-label={`View profile of ${freelancer.name}`}
        >
            <div className="relative h-48 bg-slate-800">
                {freelancer.photos && freelancer.photos.length > 0 ? (
                    <Image
                        src={freelancer.photos[0]}
                        alt={`${freelancer.name} - Massage therapist in ${freelancer.location.name}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 to-transparent">
                    <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
                        {freelancer.location.name}
                    </span>
                </div>
            </div>

            <div className="p-4 md:p-6 flex flex-col flex-1">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {freelancer.name}
                </h3>

                <p className="text-slate-400 text-xs md:text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
                    {freelancer.bio}
                </p>

                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {freelancer.services.slice(0, 3).map(service => (
                            <span
                                key={service.id}
                                className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-medium rounded-md uppercase tracking-wider"
                            >
                                {service.treatment.name}
                            </span>
                        ))}
                        {freelancer.services.length > 3 && (
                            <span className="text-slate-500 text-[10px] font-medium">
                                +{freelancer.services.length - 3} more
                            </span>
                        )}
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-emerald-400 text-xs md:text-sm font-bold">
                        <span>View Profile</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    )
}
