import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/treatments`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/freelancers`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ]

  try {
    // Dynamic treatment pages
    const treatments = await prisma.treatment.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    })

    const treatmentPages: MetadataRoute.Sitemap = treatments.map((treatment) => ({
      url: `${baseUrl}/treatments/${treatment.slug}`,
      lastModified: treatment.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Dynamic location pages
    const locations = await prisma.location.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    })

    const locationPages: MetadataRoute.Sitemap = locations.map((location) => ({
      url: `${baseUrl}/locations/${location.slug}`,
      lastModified: location.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Dynamic freelancer pages
    const freelancers = await prisma.freelancerProfile.findMany({
      where: { status: 'APPROVED' },
      select: { slug: true, updatedAt: true },
    })

    const freelancerPages: MetadataRoute.Sitemap = freelancers.map((freelancer) => ({
      url: `${baseUrl}/freelancers/${freelancer.slug}`,
      lastModified: freelancer.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...treatmentPages, ...locationPages, ...freelancerPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
