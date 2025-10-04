import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'League of Flex | Custom 5v5 Team Generator for League of Legends',
  description:
    'Generate balanced 5v5 custom teams for League of Legends based on player ranks. Free team balancing tool for your LoL community, in-house games, and tournaments. Join our Discord community today!',
  keywords:
    'League of Legends, custom 5v5, team generator, balanced teams, LoL tournaments, in-house games, team balancing, LoL customs, team maker, fair matches, captains mode, esports',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  authors: [{ name: 'League of Flex' }],
  applicationName: 'League of Flex',
  creator: 'League of Flex Team',
  publisher: 'League of Flex',
  alternates: {
    canonical: 'https://leagueofflex.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://leagueofflex.com',
    siteName: 'League of Flex',
    title: 'League of Flex | Custom 5v5 League of Legends Team Generator',
    description:
      'Free balanced team generator for League of Legends customs. Create fair 5v5 matches based on player ranks. Join our community for tournaments and in-house games.',
    images: [
      {
        url: 'https://leagueofflex.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'League of Flex Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'League of Flex | Custom 5v5 Team Generator for League of Legends',
    description: 'Free balanced team generator for League of Legends customs. Create fair 5v5 matches based on player ranks.',
    images: ['https://leagueofflex.com/images/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/images/logo.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/images/logo.png',
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/images/logo.png',
      },
    ],
  },
  metadataBase: new URL('https://leagueofflex.com'),
  verification: {
    google: 'add-your-google-verification-code-here',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'League of Flex',
              url: 'https://leagueofflex.com',
              logo: 'https://leagueofflex.com/images/logo.png',
              description: 'Custom 5v5 Team Generator for League of Legends',
              sameAs: ['https://discord.gg/leagueofflex'],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Community Support',
                url: 'https://discord.gg/leagueofflex',
              },
            }),
          }}
        />
        <Script
          id="software-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'League of Flex',
              applicationCategory: 'GameApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description:
                'Generate balanced 5v5 custom teams for League of Legends based on player ranks.',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '150',
              },
            }),
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'League of Flex',
              url: 'https://leagueofflex.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://leagueofflex.com/customs?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <SpeedInsights />
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
