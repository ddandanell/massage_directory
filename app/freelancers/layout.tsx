import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Find Massage Therapists in Bali - Professional Directory',
    description: 'Search and discover verified massage therapists across Bali. Filter by location, treatment type, and connect with experienced professionals offering authentic massage experiences.',
    openGraph: {
        title: 'Find Massage Therapists in Bali',
        description: 'Discover verified massage therapists and connect with experienced professionals offering authentic treatments.',
        type: 'website'
    }
}

export default function FreelancersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
