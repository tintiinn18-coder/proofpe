import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ProofPe — India's Verified Startup Revenue Leaderboard",
    template: "%s | ProofPe"
  },
  description:
    "Discover Indian startups with real revenue, MRR, and growth. Submit your startup and build trust.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "ProofPe — India's Verified Startup Revenue Leaderboard",
    description:
      "Discover Indian startups with real revenue, MRR, and growth.",
    url: siteUrl,
    siteName: "ProofPe",
    type: "website",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "ProofPe — India's Verified Startup Revenue Leaderboard",
    description:
      "Discover Indian startups with real revenue, MRR, and growth."
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className={`${inter.className} text-ink antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
