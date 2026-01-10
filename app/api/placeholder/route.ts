import { NextResponse } from 'next/server'

/**
 * Generate a simple SVG placeholder image
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const text = searchParams.get('text') || 'Massage Directory'
    const width = parseInt(searchParams.get('w') || '800')
    const height = parseInt(searchParams.get('h') || '600')

    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#064e3b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#065f46;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#10b981" text-anchor="middle" dominant-baseline="middle" opacity="0.3">${text}</text>
    </svg>
  `.trim()

    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    })
}
