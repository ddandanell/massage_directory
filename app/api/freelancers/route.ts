import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const locationId = searchParams.get('locationId')
        const treatmentId = searchParams.get('treatmentId')
        const query = searchParams.get('query')

        const where: any = {
            status: 'APPROVED'
        }

        if (locationId) {
            where.locationId = locationId
        }

        if (treatmentId) {
            where.services = {
                some: {
                    treatmentId: treatmentId
                }
            }
        }

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { bio: { contains: query, mode: 'insensitive' } },
                { experience: { contains: query, mode: 'insensitive' } }
            ]
        }

        const freelancers = await prisma.freelancerProfile.findMany({
            where,
            include: {
                location: true,
                services: {
                    include: {
                        treatment: true
                    },
                    take: 5 // Just show some primary services
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ freelancers })
    } catch (error) {
        console.error('Error fetching freelancers:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
