import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const treatments = await prisma.treatment.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ treatments })
    } catch (error) {
        console.error('Error fetching treatments:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id, isPublished } = await request.json()

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
        }

        const treatment = await prisma.treatment.update({
            where: { id },
            data: { isPublished }
        })

        return NextResponse.json({ treatment })
    } catch (error) {
        console.error('Error updating treatment:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
