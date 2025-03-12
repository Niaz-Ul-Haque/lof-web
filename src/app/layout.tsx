import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'League of Flex | Custom 5v5 Team Generator for League of Legends',
  description:
    'Generate balanced 5v5 custom teams for League of Legends based on player ranks. Free team balancing tool for your LoL community, in-house games, and tournaments.',
  keywords:
    'League of Legends, custom 5v5, team generator, balanced teams, LoL tournaments, in-house games, team balancing',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://leagueofflex.com',
    siteName: 'League of Flex',
    title: 'League of Flex | Custom 5v5 League of Legends Team Generator',
    description:
      'Free balanced team generator for League of Legends customs. Create fair 5v5 matches based on player ranks.',
  },
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://leagueofflex.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
