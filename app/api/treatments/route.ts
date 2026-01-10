import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all treatments for selection
export async function GET() {
    try {
        const treatments = await prisma.treatment.findMany({
            where: { isPublished: true },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                category: true,
                description: true,
                priceRangeIndonesiaMin: true,
                priceRangeIndonesiaMax: true,
                durationOptions: true
            }
        })

        return NextResponse.json({ treatments })
    } catch (error) {
        console.error('Error fetching treatments:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
