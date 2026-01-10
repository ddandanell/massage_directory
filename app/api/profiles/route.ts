import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const profileSchema = z.object({
    name: z.string().min(2).max(100),
    bio: z.string().min(50).max(2000),
    experience: z.string().min(50).max(2000),
    locationId: z.string(),
    availability: z.string().optional(),
    contactPhone: z.string().optional(),
    contactEmail: z.string().email().optional(),
    contactWhatsApp: z.string().optional(),
    photos: z.array(z.string().url()).max(10),
    services: z.array(z.object({
        treatmentId: z.string(),
        customPricing: z.number().int().positive().optional(),
        durationMinutes: z.number().int().positive().optional(),
        customDescription: z.string().max(500).optional()
    }))
})

// GET - Fetch user's profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: session.user.id },
            include: {
                location: true,
                services: {
                    include: {
                        treatment: true
                    }
                }
            }
        })

        return NextResponse.json({ profile })
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create new profile
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user already has a profile
        const existing = await prisma.freelancerProfile.findUnique({
            where: { userId: session.user.id }
        })

        if (existing) {
            return NextResponse.json({ error: 'Profile already exists' }, { status: 400 })
        }

        const body = await request.json()
        const data = profileSchema.parse(body)

        // Generate slug
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

        // Create profile and services in transaction
        const profile = await prisma.$transaction(async (tx) => {
            const newProfile = await tx.freelancerProfile.create({
                data: {
                    userId: session.user.id,
                    name: data.name,
                    slug,
                    bio: data.bio,
                    experience: data.experience,
                    locationId: data.locationId,
                    availability: data.availability,
                    contactPhone: data.contactPhone,
                    contactEmail: data.contactEmail,
                    contactWhatsApp: data.contactWhatsApp,
                    photos: data.photos,
                    status: 'PENDING'
                }
            })

            // Create services
            if (data.services.length > 0) {
                await tx.service.createMany({
                    data: data.services.map(service => ({
                        freelancerProfileId: newProfile.id,
                        treatmentId: service.treatmentId,
                        customPricing: service.customPricing,
                        durationMinutes: service.durationMinutes,
                        customDescription: service.customDescription
                    }))
                })
            }

            // Create notification for admin
            await tx.notification.create({
                data: {
                    type: 'PROFILE_PENDING',
                    title: 'New Profile Pending Approval',
                    message: `${data.name} has created a profile and is awaiting approval.`
                }
            })

            return newProfile
        })

        return NextResponse.json({ profile }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
        }
        console.error('Error creating profile:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PUT - Update existing profile
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const data = profileSchema.parse(body)

        // Update profile and services in transaction
        const profile = await prisma.$transaction(async (tx) => {
            const updatedProfile = await tx.freelancerProfile.update({
                where: { userId: session.user.id },
                data: {
                    name: data.name,
                    bio: data.bio,
                    experience: data.experience,
                    locationId: data.locationId,
                    availability: data.availability,
                    contactPhone: data.contactPhone,
                    contactEmail: data.contactEmail,
                    contactWhatsApp: data.contactWhatsApp,
                    photos: data.photos
                }
            })

            // Delete existing services and recreate
            await tx.service.deleteMany({
                where: { freelancerProfileId: updatedProfile.id }
            })

            if (data.services.length > 0) {
                await tx.service.createMany({
                    data: data.services.map(service => ({
                        freelancerProfileId: updatedProfile.id,
                        treatmentId: service.treatmentId,
                        customPricing: service.customPricing,
                        durationMinutes: service.durationMinutes,
                        customDescription: service.customDescription
                    }))
                })
            }

            return updatedProfile
        })

        return NextResponse.json({ profile })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
        }
        console.error('Error updating profile:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
