/**
 * Treatment helper utilities
 */

interface TreatmentLike {
  slug: string
  origin?: string | null
}

/**
 * Determines if a treatment is related to Bali or Indonesia
 * Used to conditionally display region-specific content
 */
export function isBaliOrIndonesianTreatment(treatment: TreatmentLike): boolean {
  const balineseSlugs = ['balinese-massage', 'traditional-balinese-massage']
  
  // Check if slug matches known Balinese treatments
  if (balineseSlugs.includes(treatment.slug)) {
    return true
  }
  
  // Check if origin mentions Bali or Indonesia
  if (treatment.origin) {
    const originLower = treatment.origin.toLowerCase()
    return originLower.includes('bali') || originLower.includes('indonesia')
  }
  
  return false
}
