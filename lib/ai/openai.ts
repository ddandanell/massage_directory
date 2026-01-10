import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
}

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

/**
 * Generate content using OpenAI with structured output
 */
export async function generateContent(
    prompt: string,
    systemPrompt: string = 'You are a professional content writer specializing in massage therapy and wellness.'
): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000
        })

        return response.choices[0]?.message?.content || ''
    } catch (error) {
        console.error('OpenAI API error:', error)
        throw new Error('Failed to generate content')
    }
}

/**
 * Validate content quality
 */
export async function validateContentQuality(content: string): Promise<{
    isValid: boolean
    issues: string[]
    score: number
}> {
    const issues: string[] = []
    let score = 100

    // Check minimum length
    if (content.length < 200) {
        issues.push('Content is too short (minimum 200 characters)')
        score -= 30
    }

    // Check for placeholder text
    const placeholders = ['[placeholder]', 'TODO', 'TBD', 'lorem ipsum']
    if (placeholders.some(p => content.toLowerCase().includes(p.toLowerCase()))) {
        issues.push('Content contains placeholder text')
        score -= 40
    }

    // Check for repetitive content
    const words = content.toLowerCase().split(/\s+/)
    const uniqueWords = new Set(words)
    const uniqueRatio = uniqueWords.size / words.length
    if (uniqueRatio < 0.4) {
        issues.push('Content appears repetitive')
        score -= 20
    }

    // Check for proper sentence structure
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    if (sentences.length < 3) {
        issues.push('Content lacks proper sentence structure')
        score -= 15
    }

    return {
        isValid: score >= 60,
        issues,
        score: Math.max(0, score)
    }
}
