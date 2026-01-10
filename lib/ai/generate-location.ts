import { generateContent, validateContentQuality } from './openai'
import { prisma } from '@/lib/prisma'

interface LocationData {
    name: string
    region: string
    latitude?: number
    longitude?: number
}

interface GeneratedLocationContent {
    description: string
    massageCulture: string
}

/**
 * Generate unique location content using AI
 */
export async function generateLocationContent(
    locationData: LocationData
): Promise<GeneratedLocationContent> {
    const prompt = `
Generate unique, location-specific content for: ${locationData.name}, ${locationData.region}

Provide the following information in JSON format:

{
  "description": "A unique 250-350 word introduction to this specific location. Include: local character, tourism highlights, why visitors come here, accessibility, and what makes it unique. Be specific to THIS location, not generic to the region. SEO-optimized.",
  "massageCulture": "A detailed 200-300 word overview of massage and wellness culture specifically in ${locationData.name}. Include: local massage traditions, popular treatment types in this area, typical venues (beach, spa, home service), price ranges, local customs, and what makes massage culture here unique compared to other areas. Be specific and factual."
}

IMPORTANT RULES:
- Content must be UNIQUE to this specific location
- No template language or generic descriptions
- Be factual and specific
- Include local cultural context
- Mention specific landmarks or areas if relevant
- Discuss actual massage culture and practices
- No placeholder text
- SEO-friendly but natural language
`

    const systemPrompt = `You are a travel and wellness writer with deep knowledge of Bali and Indonesia.
You have visited ${locationData.name} and understand its unique character and massage culture.
You write unique, engaging content that is specific to each location.
You never use templates or generic descriptions.
You respond ONLY with valid JSON, no additional text.`

    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
        try {
            const response = await generateContent(prompt, systemPrompt)

            // Parse JSON response
            const content = JSON.parse(response) as GeneratedLocationContent

            // Validate both description and massage culture content
            const descValidation = await validateContentQuality(content.description)
            const cultureValidation = await validateContentQuality(content.massageCulture)

            if (!descValidation.isValid || !cultureValidation.isValid) {
                console.warn(`Content quality issues (attempt ${attempts + 1}):`, {
                    description: descValidation.issues,
                    culture: cultureValidation.issues
                })
                attempts++
                continue
            }

            // Check for template language
            const templatePhrases = [
                'this beautiful location',
                'this wonderful area',
                'visitors will find',
                'you can enjoy',
                'perfect for those'
            ]

            const hasTemplate = templatePhrases.some(phrase =>
                content.description.toLowerCase().includes(phrase) ||
                content.massageCulture.toLowerCase().includes(phrase)
            )

            if (hasTemplate) {
                console.warn('Content contains template language, regenerating...')
                attempts++
                continue
            }

            return content
        } catch (error) {
            console.error(`Error generating location content (attempt ${attempts + 1}):`, error)
            attempts++

            if (attempts >= maxAttempts) {
                throw new Error('Failed to generate valid location content after multiple attempts')
            }
        }
    }

    throw new Error('Failed to generate location content')
}

/**
 * Create a location with AI-generated content
 */
export async function createLocationWithAI(
    name: string,
    region: string,
    latitude?: number,
    longitude?: number
): Promise<any> {
    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if location already exists
    const existing = await prisma.location.findUnique({ where: { slug } })
    if (existing) {
        throw new Error(`Location with slug "${slug}" already exists`)
    }

    // Generate content
    console.log(`Generating AI content for location: ${name}, ${region}`)
    const content = await generateLocationContent({ name, region, latitude, longitude })

    // Create location
    const location = await prisma.location.create({
        data: {
            name,
            slug,
            region,
            description: content.description,
            massageCulture: content.massageCulture,
            latitude: latitude || null,
            longitude: longitude || null,
            isPublished: false // Require manual review before publishing
        }
    })

    console.log(`Created location: ${location.name} (ID: ${location.id})`)

    // Create notification for admin review
    await prisma.notification.create({
        data: {
            type: 'CONTENT_QUALITY_ALERT',
            title: 'New AI-Generated Location',
            message: `Location "${location.name}" has been generated and requires review before publishing.`
        }
    })

    return location
}

/**
 * Batch create multiple locations
 */
export async function batchCreateLocations(
    locations: Array<{ name: string; region: string; latitude?: number; longitude?: number }>
): Promise<{ success: number; failed: number; errors: string[] }> {
    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const location of locations) {
        try {
            await createLocationWithAI(location.name, location.region, location.latitude, location.longitude)
            success++

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000))
        } catch (error) {
            failed++
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            errors.push(`${location.name}: ${errorMessage}`)
            console.error(`Failed to create location "${location.name}":`, error)
        }
    }

    return { success, failed, errors }
}
