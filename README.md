# Massage Directory Platform

A comprehensive, SEO-optimized platform for massage treatments and freelancer therapists in Bali, Indonesia.

## Features

- **Treatment Encyclopedia**: 200+ massage treatments with detailed information, pricing, and benefits
- **Location Pages**: Unique content for 50+ Bali locations with local massage culture insights
- **Freelancer Profiles**: Self-service platform for massage therapists to create profiles
- **Admin Dashboard**: Full control panel for content management and profile moderation
- **AI-Powered Content**: Automated content generation with quality validation
- **SEO Optimized**: Schema markup, internal linking, and unique content per page

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4 for content generation
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone and install dependencies**:
```bash
cd massage-directory
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and add:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `OPENAI_API_KEY`: Your OpenAI API key

3. **Set up the database**:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. **Seed the database** (generates AI content):
```bash
npm run seed
```

This will:
- Generate 27 massage treatment pages with AI
- Generate 18 Bali location pages with AI
- Create an admin user (email: `admin@massage-directory.com`, password: `admin123`)

**Note**: Seeding takes 5-10 minutes and costs ~$5-10 in OpenAI API credits.

5. **Start the development server**:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
massage-directory/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   ├── treatments/         # Treatment pages
│   ├── locations/          # Location pages
│   ├── freelancers/        # Freelancer profiles
│   └── dashboard/          # User dashboard
├── lib/
│   ├── ai/                 # AI content generation
│   ├── data/               # Seed data
│   ├── auth.ts             # Authentication config
│   └── prisma.ts           # Database client
├── prisma/
│   └── schema.prisma       # Database schema
└── scripts/
    └── seed.ts             # Database seeding
```

## Usage

### Admin Access

1. Sign in at `/auth/signin` with:
   - Email: `admin@massage-directory.com`
   - Password: `admin123` (change this!)

2. Access admin dashboard at `/admin`

3. Review and publish AI-generated content:
   - Treatments: `/admin/treatments`
   - Locations: `/admin/locations`
   - Profiles: `/admin/profiles`

### Creating Freelancer Profiles

1. Users create profiles at `/dashboard/profile`
2. Profiles enter "PENDING" status
3. Admin reviews and approves/rejects at `/admin/profiles`
4. Approved profiles appear on treatment and location pages

### Generating More Content

To generate additional treatments or locations:

```typescript
import { createTreatmentWithAI } from '@/lib/ai/generate-treatment'
import { createLocationWithAI } from '@/lib/ai/generate-location'

// Generate a new treatment
await createTreatmentWithAI('Lomi Lomi Massage', 'Hawaiian', 'Hawaii')

// Generate a new location
await createLocationWithAI('Pererenan', 'South Bali', -8.6481, 115.1386)
```

## SEO Features

- **Schema Markup**: Service, LocalBusiness, and Person schemas
- **Dynamic Sitemaps**: Auto-generated from database
- **Internal Linking**: Automatic links between treatments, locations, and profiles
- **Unique Content**: AI ensures no duplicate content
- **Meta Tags**: Optimized titles and descriptions

## Database Schema

Key models:
- `Treatment`: Massage treatments with pricing and details
- `Location`: Cities/areas with unique content
- `FreelancerProfile`: Therapist profiles with approval workflow
- `Service`: Junction table linking freelancers to treatments
- `User`: Authentication and roles
- `Notification`: Admin alerts

## AI Content Generation

The platform uses OpenAI GPT-4 to generate:

1. **Treatment Pages**: Description, techniques, benefits, contraindications, pricing
2. **Location Pages**: Unique city descriptions and massage culture insights
3. **Quality Validation**: Automatic checks for content quality and uniqueness

### Content Quality Controls

- Minimum length requirements
- Placeholder text detection
- Repetition detection
- Template language detection
- Pricing plausibility checks
- Multi-attempt generation with validation loops

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```
DATABASE_URL=your-production-db-url
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
OPENAI_API_KEY=your-openai-key
```

## Roadmap

- [ ] Image upload for freelancer profiles
- [ ] Booking system integration
- [ ] Review and rating system
- [ ] Multi-language support
- [ ] Expand to other regions beyond Bali
- [ ] Mobile app

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.
