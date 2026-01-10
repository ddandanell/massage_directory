import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import crypto from 'crypto'

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' }, { status: 400 })
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size too large. Max 5MB allowed.' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const extension = file.type.split('/')[1]
        const filename = `${crypto.randomBytes(16).toString('hex')}.${extension}`
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        const path = join(uploadDir, filename)

        await writeFile(path, buffer)

        const url = `/uploads/${filename}`
        return NextResponse.json({ url })
    } catch (error) {
        console.error('Error uploading file:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
