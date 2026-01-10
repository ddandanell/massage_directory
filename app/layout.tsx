import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Massage Directory - Find the Perfect Massage in Bali",
  description: "Comprehensive guide to massage treatments and therapists in Bali. Explore treatments, find locations, and connect with qualified massage professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
        <footer className="bg-slate-950 border-t border-slate-800 mt-20">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Massage<span className="text-emerald-400">Directory</span>
                </h3>
                <p className="text-slate-400 text-sm">
                  Your comprehensive guide to massage treatments and therapists in Bali.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Explore</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/treatments" className="text-slate-400 hover:text-emerald-400 text-sm">
                      All Treatments
                    </Link>
                  </li>
                  <li>
                    <Link href="/locations" className="text-slate-400 hover:text-emerald-400 text-sm">
                      All Locations
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">For Therapists</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/dashboard/profile" className="text-slate-400 hover:text-emerald-400 text-sm">
                      Create Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/signin" className="text-slate-400 hover:text-emerald-400 text-sm">
                      Sign In
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Admin</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/admin" className="text-slate-400 hover:text-emerald-400 text-sm">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 mt-8 pt-8 text-center">
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} Massage Directory. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
