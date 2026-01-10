import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Join as Therapist - Massage Directory',
    description: 'Create your professional massage therapist profile and join our network of verified practitioners in Bali. Get discovered by clients seeking authentic massage experiences.'
}

export default function SignUpLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
