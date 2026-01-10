import { prisma, testDatabaseConnection } from '../lib/prisma'

async function main() {
    console.log('🔍 Checking database connection...\n')

    // Test connection
    const isConnected = await testDatabaseConnection()

    if (!isConnected) {
        console.error('\n❌ Database connection failed!')
        console.error('Please check your DATABASE_URL in .env file')
        process.exit(1)
    }

    // Test basic queries
    try {
        console.log('📊 Testing database queries...')
        
        const [treatmentCount, locationCount, freelancerCount, userCount] = await Promise.all([
            prisma.treatment.count(),
            prisma.location.count(),
            prisma.freelancerProfile.count(),
            prisma.user.count(),
        ])

        console.log(`\n📈 Database Statistics:`)
        console.log(`  - Treatments: ${treatmentCount}`)
        console.log(`  - Locations: ${locationCount}`)
        console.log(`  - Freelancer Profiles: ${freelancerCount}`)
        console.log(`  - Users: ${userCount}`)

        console.log('\n✅ Database is ready!')
    } catch (error: any) {
        console.error('\n❌ Database query error:', error.message)
        console.error('\n💡 You may need to run migrations:')
        console.error('   npm run prisma:migrate')
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
