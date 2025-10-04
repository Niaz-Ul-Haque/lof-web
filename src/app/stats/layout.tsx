import React from 'react';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'LoL Stats Dashboard | League of Flex',
  description:
    'View detailed League of Legends statistics and analytics from our community matches and tournaments. Track player performance, match history, and rankings.',
  keywords:
    'League of Legends stats, LoL statistics, player stats, match history, LoL analytics, gaming statistics',
  openGraph: {
    title: 'LoL Stats Dashboard | League of Flex',
    description: 'Comprehensive League of Legends statistics and match analytics',
    url: 'https://leagueofflex.com/stats',
    type: 'website',
    images: [
      {
        url: 'https://leagueofflex.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'League of Flex Stats Dashboard',
      },
    ],
  },
  alternates: {
    canonical: 'https://leagueofflex.com/stats',
  },
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
