import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch pending profiles (admin only)
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const profiles = await prisma.freelancerProfile.findMany({
            where: { status: 'PENDING' },
            include: {
                user: {
                    select: {
                        email: true
                    }
                },
                location: true,
                services: {
                    include: {
                        treatment: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ profiles })
    } catch (error) {
        console.error('Error fetching pending profiles:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Approve or reject profile
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { profileId, action, rejectionReason } = await request.json()

        if (!profileId || !action || !['approve', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        const profile = await prisma.freelancerProfile.update({
            where: { id: profileId },
            data: {
                status: action === 'approve' ? 'APPROVED' : 'REJECTED',
                rejectionReason: action === 'reject' ? rejectionReason : null
            }
        })

        return NextResponse.json({ profile })
    } catch (error) {
        console.error('Error updating profile status:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
