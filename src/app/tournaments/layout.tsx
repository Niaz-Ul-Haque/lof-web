import React from 'react';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'LoL Tournaments | League of Flex',
  description:
    'Join official League of Legends tournaments organized by our community. Compete with players at your skill level and win prizes.',
  openGraph: {
    title: 'League of Legends Tournaments | League of Flex',
    description: 'Compete in community-organized LoL tournaments with balanced teams',
    images: ['/images/tournament.jpg'],
  },
};

export default function TournamentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
