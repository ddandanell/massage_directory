import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign In - Massage Directory',
    description: 'Sign in to your massage therapist account to manage your profile and connect with clients in Bali.'
}

export default function SignInLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
