import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin Dashboard - Massage Directory',
    description: 'Admin control panel for managing treatments, locations, and therapist profiles on the Massage Directory platform.'
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
