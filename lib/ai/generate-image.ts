import { openai } from './openai'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import crypto from 'crypto'
import { existsSync, mkdirSync } from 'fs'

/**
 * Generate an AI image using DALL-E 3
 */
export async function generateImage(
    prompt: string,
    size: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024'
): Promise<string> {
    try {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not configured')
        }

        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: size === '1024x1024' ? '1024x1024' : '1024x1024',
            quality: 'standard',
            style: 'natural',
        })

        const imageUrl = response.data[0]?.url
        if (!imageUrl) {
            throw new Error('No image URL returned from OpenAI')
        }

        // Download and save the image
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
            throw new Error('Failed to download generated image')
        }

        const imageBuffer = await imageResponse.arrayBuffer()
        const buffer = Buffer.from(imageBuffer)

        // Ensure uploads directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'ai-generated')
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true })
        }

        // Save the image
        const filename = `ai-${crypto.randomBytes(8).toString('hex')}.png`
        const filepath = join(uploadDir, filename)
        await writeFile(filepath, buffer)

        // Return the public URL
        return `/uploads/ai-generated/${filename}`
    } catch (error) {
        console.error('Error generating image:', error)
        // Return a placeholder gradient URL instead
        return `/api/placeholder?text=${encodeURIComponent(prompt.substring(0, 50))}`
    }
}

/**
 * Generate a massage treatment image
 */
export async function generateTreatmentImage(treatmentName: string, origin?: string): Promise<string> {
    const prompt = `Professional, calming image of ${treatmentName} massage therapy${origin ? ` from ${origin}` : ''}. Peaceful spa environment, soft lighting, wellness atmosphere, professional massage setting, high quality photography, serene and relaxing mood, no text or logos`
    return generateImage(prompt, '1024x1024')
}

/**
 * Generate a location image for Bali
 */
export async function generateLocationImage(locationName: string, region: string): Promise<string> {
    const prompt = `Beautiful view of ${locationName}, ${region}, Bali, Indonesia. Tropical paradise, serene beach or landscape, wellness destination, peaceful atmosphere, professional photography, vibrant colors, no text or logos`
    return generateImage(prompt, '1024x1024')
}

/**
 * Generate a therapist/freelancer profile image
 */
export async function generateTherapistImage(name: string, location?: string): Promise<string> {
    const prompt = `Professional portrait of a friendly, trustworthy massage therapist${location ? ` in ${location}, Bali` : ''}. Warm, approachable smile, professional attire, clean and calming background, wellness professional, high quality photography, no text or logos`
    return generateImage(prompt, '1024x1024')
}

/**
 * Generate a placeholder image if AI generation is not available
 */
export function getPlaceholderImageUrl(text: string, width: number = 800, height: number = 600): string {
    // Use local placeholder API that generates SVG gradients
    return `/api/placeholder?text=${encodeURIComponent(text.substring(0, 50))}&w=${width}&h=${height}`
}
