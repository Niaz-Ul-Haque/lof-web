import React from 'react';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'LoL Tournaments | League of Flex',
  description:
    'Join official League of Legends tournaments organized by our community. Compete with players at your skill level and win prizes. Single elimination, double elimination, and more formats.',
  keywords:
    'League of Legends tournaments, LoL competitive, esports tournaments, LoL community events, gaming competitions',
  openGraph: {
    title: 'League of Legends Tournaments | League of Flex',
    description: 'Compete in community-organized LoL tournaments with balanced teams and win prizes',
    url: 'https://leagueofflex.com/tournaments',
    type: 'website',
    images: [
      {
        url: 'https://leagueofflex.com/images/tournament.jpg',
        width: 1200,
        height: 630,
        alt: 'League of Flex Tournaments',
      },
    ],
  },
  alternates: {
    canonical: 'https://leagueofflex.com/tournaments',
  },
};

export default function TournamentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
