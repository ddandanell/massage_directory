/**
 * External links configuration
 * Centralized management of external partner links for easier maintenance
 */

export const EXTERNAL_LINKS = {
  HOME_MASSAGE_UBUD: {
    url: 'https://homemassageubud.com/',
    name: 'Home Massage Ubud',
    description: 'Professional home massage services in Ubud'
  }
} as const

export type ExternalLinkKey = keyof typeof EXTERNAL_LINKS
