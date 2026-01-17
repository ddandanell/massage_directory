import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { getPlaceholderImageUrl } from '@/lib/ai/generate-image'

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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Massage Experience
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Discover authentic massage experiences across Bali. Our comprehensive directory connects you with verified therapists offering traditional and modern treatments. Whether you&apos;re seeking relaxation, therapeutic healing, or cultural wellness practices, find your perfect massage experience. Looking for a <a href="https://homemassageubud.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-400/30 hover:decoration-emerald-300 transition-colors">convenient home massage service in Ubud</a>? We can help connect you with the best options.
            </p>
            {treatmentCount > 0 && freelancerCount > 0 && locationCount > 0 && (
              <p className="text-base md:text-lg text-slate-400 mb-6 md:mb-8 px-4">
                Explore {treatmentCount} massage treatments • {freelancerCount} verified therapists • {locationCount} locations in Bali
              </p>
            )}
            <div className="flex flex-wrap gap-4 justify-center px-4">
              <Link
                href="/freelancers"
                className="px-6 md:px-8 py-3 md:py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm md:text-base"
              >
                Find a Therapist
              </Link>
              <Link
                href="/treatments"
                className="px-6 md:px-8 py-3 md:py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all hover:scale-105 text-sm md:text-base"
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
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Popular Massage Treatments</h2>
          <p className="text-slate-400 text-lg">Discover authentic massage experiences from around the world. Each treatment offers unique techniques, benefits, and healing properties.</p>
        </div>
        {featuredTreatments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTreatments.map((treatment: any) => (
                <Link
                  key={treatment.id}
                  href={`/treatments/${treatment.slug}`}
                  className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500 transition-all hover:scale-105"
                >
                <div className="relative h-48 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 overflow-hidden">
                  <Image
                    src={getPlaceholderImageUrl(treatment.name, 800, 600)}
                    alt={`${treatment.name} massage therapy`}
                    fill
                    className="object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-24 h-24 text-emerald-500/30 group-hover:text-emerald-500/50 transition-colors relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {treatment.name}
                    </h3>
                    {treatment.origin && (
                      <p className="text-slate-400 text-sm mb-3">Origin: {treatment.origin}</p>
                    )}
                    <p className="text-slate-300 line-clamp-3 text-sm leading-relaxed">{treatment.description}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/treatments"
                className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all hover:scale-105"
              >
                View All Treatments →
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-800 text-center">
            <p className="text-slate-400 text-lg mb-4">No treatments available yet.</p>
            <p className="text-slate-500 text-sm">Check back soon for featured massage treatments.</p>
          </div>
        )}
      </div>

      {/* Featured Locations */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Explore Bali Locations</h2>
          <p className="text-slate-400 text-lg">Discover massage therapists across different regions of Bali. Each area offers unique wellness experiences and cultural traditions. For those staying in the cultural heart of Bali, explore our partner&apos;s specialized <a href="https://homemassageubud.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-400/30 hover:decoration-emerald-300 transition-colors">home massage services in Ubud</a>.</p>
        </div>
        {featuredLocations.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredLocations.map((location: any) => (
                <Link
                  key={location.id}
                  href={`/locations/${location.slug}`}
                  className="group p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-emerald-500 transition-all hover:scale-105 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-all">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">{location.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{location.region}</p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/locations"
                className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all hover:scale-105"
              >
                View All Locations →
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-800 text-center">
            <p className="text-slate-400 text-lg mb-4">No locations available yet.</p>
            <p className="text-slate-500 text-sm">Locations will be added soon.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Home Massage Services Info */}
        <div className="bg-gradient-to-r from-teal-900/30 to-emerald-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-teal-800/50 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prefer Massage at Your Accommodation?</h2>
          <p className="text-lg md:text-xl text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed">
            Experience the ultimate convenience with professional massage therapists who come to you. Perfect for those staying in Ubud who want authentic Balinese treatments in the privacy and comfort of their villa or hotel.
          </p>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Our partner provides reliable, professional home massage services throughout the Ubud area, featuring experienced therapists trained in traditional and modern techniques.
          </p>
          <a
            href="https://homemassageubud.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
          >
            Explore Home Massage in Ubud →
          </a>
        </div>

        <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 backdrop-blur-sm rounded-3xl p-12 border border-emerald-800 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Are You a Massage Therapist?</h2>
          <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed">
            Join our platform and connect with clients looking for authentic massage experiences. Showcase your expertise, build your reputation, and grow your practice.
          </p>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Create your professional profile in minutes and start appearing in search results. Our team reviews all profiles to ensure quality and trust.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard/profile"
              className="inline-block px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Create Your Profile
            </Link>
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all hover:scale-105"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
