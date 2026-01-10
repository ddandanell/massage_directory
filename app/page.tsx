import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const stats = await prisma.$transaction([
    prisma.treatment.count({ where: { isPublished: true } }),
    prisma.location.count({ where: { isPublished: true } }),
    prisma.freelancerProfile.count({ where: { status: 'APPROVED' } })
  ])

  const [treatmentCount, locationCount, freelancerCount] = stats

  const featuredTreatments = await prisma.treatment.findMany({
    where: { isPublished: true },
    take: 6,
    orderBy: { createdAt: 'desc' }
  })

  const featuredLocations = await prisma.location.findMany({
    where: { isPublished: true },
    take: 6,
    orderBy: { name: 'asc' }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Massage Experience
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Explore {treatmentCount} massage treatments and connect with {freelancerCount} qualified therapists
              across {locationCount} locations in Bali
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/freelancers"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Find a Therapist
              </Link>
              <Link
                href="/treatments"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all hover:scale-105"
              >
                Browse Treatments
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
            <p className="text-5xl font-bold text-emerald-400 mb-2">{treatmentCount}+</p>
            <p className="text-slate-300">Massage Treatments</p>
          </div>
          <div className="text-center p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
            <p className="text-5xl font-bold text-emerald-400 mb-2">{locationCount}+</p>
            <p className="text-slate-300">Locations in Bali</p>
          </div>
          <div className="text-center p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
            <p className="text-5xl font-bold text-emerald-400 mb-2">{freelancerCount}+</p>
            <p className="text-slate-300">Verified Therapists</p>
          </div>
        </div>
      </div>

      {/* Featured Treatments */}
      {featuredTreatments.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Popular Treatments</h2>
            <p className="text-slate-400">Discover the most sought-after massage experiences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTreatments.map((treatment: any) => (
              <Link
                key={treatment.id}
                href={`/treatments/${treatment.slug}`}
                className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-emerald-500 transition-all hover:scale-105"
              >
                <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-emerald-400">
                  {treatment.name}
                </h3>
                {treatment.origin && (
                  <p className="text-slate-400 text-sm mb-3">Origin: {treatment.origin}</p>
                )}
                <p className="text-slate-300 line-clamp-3">{treatment.description}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/treatments"
              className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all"
            >
              View All Treatments →
            </Link>
          </div>
        </div>
      )}

      {/* Featured Locations */}
      {featuredLocations.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Explore Bali</h2>
            <p className="text-slate-400">Find massage therapists in your area</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredLocations.map((location: any) => (
              <Link
                key={location.id}
                href={`/locations/${location.slug}`}
                className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-emerald-500 transition-all hover:scale-105 text-center"
              >
                <p className="text-lg font-semibold text-emerald-400">{location.name}</p>
                <p className="text-xs text-slate-400 mt-1">{location.region}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/locations"
              className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all"
            >
              View All Locations →
            </Link>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 backdrop-blur-sm rounded-3xl p-12 border border-emerald-800 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Are You a Massage Therapist?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join our platform and connect with clients looking for your services. Create your profile in minutes.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-block px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
          >
            Create Your Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
