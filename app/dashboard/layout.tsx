import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard - Manage Your Profile',
    description: 'Manage your massage therapist profile, view your profile status, and track your services on the Massage Directory platform.'
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
