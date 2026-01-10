import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/dashboard/ProfileForm'

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/auth/signin')
    }

    // Fetch essential data for the form
    const [profile, locations, treatments] = await Promise.all([
        prisma.freelancerProfile.findUnique({
            where: { userId: session.user.id },
            include: {
                services: {
                    include: {
                        treatment: true
                    }
                }
            }
        }),
        prisma.location.findMany({
            where: { isPublished: true },
            orderBy: { name: 'asc' }
        }),
        prisma.treatment.findMany({
            where: { isPublished: true },
            orderBy: { name: 'asc' }
        })
    ])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {profile ? 'Edit Your Profile' : 'Create Your Professional Profile'}
                    </h1>
                    <p className="text-slate-400">
                        {profile
                            ? 'Update your information and manage the services you offer.'
                            : 'Fill out the details below to join our network of professional massage therapists in Bali.'}
                    </p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800">
                    <ProfileForm
                        initialData={profile}
                        locations={locations}
                        treatments={treatments}
                    />
                </div>
            </div>
        </div>
    )
}
