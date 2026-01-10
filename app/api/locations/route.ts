import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all locations for selection
export async function GET() {
    try {
        const locations = await prisma.location.findMany({
            where: { isPublished: true },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                region: true
            }
        })

        return NextResponse.json({ locations })
    } catch (error) {
        console.error('Error fetching locations:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
