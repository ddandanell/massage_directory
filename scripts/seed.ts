#!/usr/bin/env tsx

/**
 * Database seeding script
 * Generates initial treatments and locations using AI
 * 
 * Usage:
 * npm run seed
 */

import { PrismaClient } from '@prisma/client'
import { TREATMENT_SEEDS, BALI_LOCATION_SEEDS } from '../lib/data/seeds'
import { batchCreateTreatments } from '../lib/ai/generate-treatment'
import { batchCreateLocations } from '../lib/ai/generate-location'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...\n')

    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ OPENAI_API_KEY environment variable is not set')
        console.log('Please set your OpenAI API key in .env file')
        process.exit(1)
    }

    // Seed treatments
    console.log(`📚 Generating ${TREATMENT_SEEDS.length} treatments with AI...`)
    console.log('This will take approximately 2-3 minutes...\n')

    const treatmentResults = await batchCreateTreatments(TREATMENT_SEEDS)

    console.log('\n✅ Treatment generation complete:')
    console.log(`   - Success: ${treatmentResults.success}`)
    console.log(`   - Failed: ${treatmentResults.failed}`)

    if (treatmentResults.errors.length > 0) {
        console.log('\n⚠️  Errors:')
        treatmentResults.errors.forEach(error => console.log(`   - ${error}`))
    }

    // Seed locations
    console.log(`\n🗺️  Generating ${BALI_LOCATION_SEEDS.length} Bali locations with AI...`)
    console.log('This will take approximately 1-2 minutes...\n')

    const locationResults = await batchCreateLocations(BALI_LOCATION_SEEDS)

    console.log('\n✅ Location generation complete:')
    console.log(`   - Success: ${locationResults.success}`)
    console.log(`   - Failed: ${locationResults.failed}`)

    if (locationResults.errors.length > 0) {
        console.log('\n⚠️  Errors:')
        locationResults.errors.forEach(error => console.log(`   - ${error}`))
    }

    // Create admin user
    console.log('\n👤 Creating admin user...')

    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash('admin123', 10)

    try {
        const admin = await prisma.user.upsert({
            where: { email: 'admin@massage-directory.com' },
            update: {},
            create: {
                email: 'admin@massage-directory.com',
                password: hashedPassword,
                name: 'Admin',
                role: 'ADMIN'
            }
        })
        console.log(`✅ Admin user created: ${admin.email}`)
        console.log('   Password: admin123 (change this in production!)')
    } catch (error) {
        console.error('❌ Failed to create admin user:', error)
    }

    console.log('\n🎉 Database seeding complete!')
    console.log('\nNext steps:')
    console.log('1. Review generated content in admin dashboard')
    console.log('2. Publish treatments and locations')
    console.log('3. Set up related treatments')
    console.log('4. Change admin password\n')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
