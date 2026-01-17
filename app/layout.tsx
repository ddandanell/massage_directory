import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { EXTERNAL_LINKS } from "@/lib/constants/external-links";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: "Massage Directory - Find the Perfect Massage in Bali",
    template: "%s | Massage Directory"
  },
  description: "Comprehensive guide to massage treatments and therapists in Bali. Explore authentic treatments, find verified professionals, and discover wellness experiences across Bali. Connect with qualified massage therapists offering traditional and modern techniques.",
  keywords: ["massage", "Bali", "massage therapist", "wellness", "spa", "therapeutic massage", "Bali massage", "massage directory", "wellness directory"],
  authors: [{ name: "Massage Directory" }],
  creator: "Massage Directory",
  publisher: "Massage Directory",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Massage Directory",
    title: "Massage Directory - Find the Perfect Massage in Bali",
    description: "Comprehensive guide to massage treatments and therapists in Bali. Explore authentic treatments and find verified professionals.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Massage Directory - Find the Perfect Massage in Bali",
    description: "Comprehensive guide to massage treatments and therapists in Bali.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Massage Directory',
    description: 'Comprehensive guide to massage treatments and therapists in Bali',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/freelancers?query={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main>
            {children}
          </main>
        </Providers>

        {/* Footer */}
        <footer className="bg-slate-950 border-t border-slate-800 mt-12 md:mt-20">
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">
                  Massage<span className="text-emerald-400">Directory</span>
                </h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Your comprehensive guide to massage treatments and therapists in Bali.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Explore</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/treatments" className="text-slate-400 hover:text-emerald-400 text-xs md:text-sm transition-colors">
                      All Treatments
                    </Link>
                  </li>
                  <li>
                    <Link href="/locations" className="text-slate-400 hover:text-emerald-400 text-xs md:text-sm transition-colors">
                      All Locations
                    </Link>
                  </li>
                  <li>
                    <Link href="/freelancers" className="text-slate-400 hover:text-emerald-400 text-xs md:text-sm transition-colors">
                      Find Therapist
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">For Therapists</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/auth/signup" className="text-slate-400 hover:text-emerald-400 text-xs md:text-sm transition-colors">
                      Join as Therapist
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/signin" className="text-slate-400 hover:text-emerald-400 text-xs md:text-sm transition-colors">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/profile" className="text-slate-400 hover:text-emerald-400 text-xs md:text-sm transition-colors">
                      Create Profile
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-span-2 md:col-span-1">
                <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">About</h4>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-3">
                  Connecting clients with verified massage therapists across Bali.
                </p>
                <h5 className="font-semibold text-white mb-2 text-xs md:text-sm">Partners</h5>
                <ul className="space-y-2">
                  <li>
                    <a href={EXTERNAL_LINKS.HOME_MASSAGE_UBUD.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 text-xs md:text-sm transition-colors">
                      Home Massage Ubud
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
              <p className="text-slate-500 text-xs md:text-sm">
                © {new Date().getFullYear()} Massage Directory. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
