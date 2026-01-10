import { generateContent, validateContentQuality } from './openai'
import { prisma } from '@/lib/prisma'

interface TreatmentData {
    name: string
    category?: string
    origin?: string
}

interface GeneratedTreatmentContent {
    description: string
    origin: string
    techniques: string
    durationOptions: number[]
    benefits: string
    contraindications: string
    priceRangeGlobalMin: number
    priceRangeGlobalMax: number
    priceRangeIndonesiaMin: number
    priceRangeIndonesiaMax: number
    whoShouldBook: string
    whoShouldNotBook: string
    aliases: string[]
}

/**
 * Generate comprehensive treatment content using AI
 */
export async function generateTreatmentContent(
    treatmentData: TreatmentData
): Promise<GeneratedTreatmentContent> {
    const prompt = `
Generate comprehensive, factual content for the massage treatment: "${treatmentData.name}"

Provide the following information in JSON format:

{
  "description": "A detailed 200-300 word description of this massage treatment. Be specific, factual, and SEO-friendly. Explain what makes this treatment unique.",
  "origin": "The geographic or cultural origin of this treatment (e.g., 'Sweden', 'Thailand', 'Ancient Rome')",
  "techniques": "Detailed explanation of the specific techniques used in this treatment (150-200 words). Include pressure types, movements, tools used, etc.",
  "durationOptions": [60, 90, 120],
  "benefits": "List of specific benefits this treatment provides. Include physical, mental, and emotional benefits. Be specific and evidence-based. (100-150 words)",
  "contraindications": "List of conditions or situations where this treatment should be avoided or used with caution. Be thorough and safety-focused. (100-150 words)",
  "priceRangeGlobalMin": 50,
  "priceRangeGlobalMax": 150,
  "priceRangeIndonesiaMin": 150000,
  "priceRangeIndonesiaMax": 500000,
  "whoShouldBook": "Describe the ideal client for this treatment. Who would benefit most? (50-100 words)",
  "whoShouldNotBook": "Describe who should avoid this treatment or seek medical advice first. (50-100 words)",
  "aliases": ["alternative name 1", "alternative name 2"]
}

IMPORTANT RULES:
- All content must be factual and conservative
- Do not make medical claims that cannot be verified
- Price ranges should be realistic based on global market research
- Indonesian prices are in IDR (Indonesian Rupiah)
- Global prices are in USD cents (so $50 = 5000)
- Duration options in minutes
- Be specific and avoid generic statements
- No placeholder text or vague descriptions
`

    const systemPrompt = `You are a professional massage therapy researcher and content writer. 
You have deep knowledge of massage treatments worldwide, their origins, techniques, and benefits.
You always provide factual, well-researched content with realistic pricing based on market research.
You prioritize safety and never make unverified medical claims.
You respond ONLY with valid JSON, no additional text.`

    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
        try {
            const response = await generateContent(prompt, systemPrompt)

            // Parse JSON response
            const content = JSON.parse(response) as GeneratedTreatmentContent

            // Validate content quality
            const validation = await validateContentQuality(content.description)

            if (!validation.isValid) {
                console.warn(`Content quality issues (attempt ${attempts + 1}):`, validation.issues)
                attempts++
                continue
            }

            // Validate pricing plausibility
            if (content.priceRangeGlobalMin < 1000 || content.priceRangeGlobalMax > 50000) {
                console.warn('Implausible global pricing, regenerating...')
                attempts++
                continue
            }

            if (content.priceRangeIndonesiaMin < 50000 || content.priceRangeIndonesiaMax > 5000000) {
                console.warn('Implausible Indonesian pricing, regenerating...')
                attempts++
                continue
            }

            return content
        } catch (error) {
            console.error(`Error generating treatment content (attempt ${attempts + 1}):`, error)
            attempts++

            if (attempts >= maxAttempts) {
                throw new Error('Failed to generate valid treatment content after multiple attempts')
            }
        }
    }

    throw new Error('Failed to generate treatment content')
}

/**
 * Create a treatment with AI-generated content
 */
export async function createTreatmentWithAI(
    name: string,
    category?: string,
    origin?: string
): Promise<any> {
    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if treatment already exists
    const existing = await prisma.treatment.findUnique({ where: { slug } })
    if (existing) {
        throw new Error(`Treatment with slug "${slug}" already exists`)
    }

    // Generate content
    console.log(`Generating AI content for treatment: ${name}`)
    const content = await generateTreatmentContent({ name, category, origin })

    // Create treatment
    const treatment = await prisma.treatment.create({
        data: {
            name,
            slug,
            category: category || null,
            aliases: content.aliases,
            description: content.description,
            origin: content.origin,
            techniques: content.techniques,
            durationOptions: content.durationOptions,
            benefits: content.benefits,
            contraindications: content.contraindications,
            priceRangeGlobalMin: content.priceRangeGlobalMin,
            priceRangeGlobalMax: content.priceRangeGlobalMax,
            priceRangeIndonesiaMin: content.priceRangeIndonesiaMin,
            priceRangeIndonesiaMax: content.priceRangeIndonesiaMax,
            whoShouldBook: content.whoShouldBook,
            whoShouldNotBook: content.whoShouldNotBook,
            isPublished: false // Require manual review before publishing
        }
    })

    console.log(`Created treatment: ${treatment.name} (ID: ${treatment.id})`)

    // Create notification for admin review
    await prisma.notification.create({
        data: {
            type: 'CONTENT_QUALITY_ALERT',
            title: 'New AI-Generated Treatment',
            message: `Treatment "${treatment.name}" has been generated and requires review before publishing.`
        }
    })

    return treatment
}

/**
 * Batch create multiple treatments
 */
export async function batchCreateTreatments(
    treatments: Array<{ name: string; category?: string; origin?: string }>
): Promise<{ success: number; failed: number; errors: string[] }> {
    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const treatment of treatments) {
        try {
            await createTreatmentWithAI(treatment.name, treatment.category, treatment.origin)
            success++

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000))
        } catch (error) {
            failed++
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            errors.push(`${treatment.name}: ${errorMessage}`)
            console.error(`Failed to create treatment "${treatment.name}":`, error)
        }
    }

    return { success, failed, errors }
}
